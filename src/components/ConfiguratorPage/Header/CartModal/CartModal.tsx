import React, { useState } from 'react';
import { ModelConfig } from '../../Viewer/defaults';
import { loadStripe } from '@stripe/stripe-js';
import { PARAMETER_DEFINITIONS } from '../../ParameterPanel/parameterDefintions';

export interface CartItem {
  id: string;
  configs: ModelConfig[];
  totalPrice: number;
  quantity: number;
  frameName: string;
}

interface CartModalProps {
  onClose: () => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  onConfigChange: (configs: ModelConfig[]) => void;
}

const CartModal: React.FC<CartModalProps> = ({
  onClose,
  cart,
  setCart,
  onConfigChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [shippingDestination, setShippingDestination] = useState<'UK' | 'International'>();

  const onRemoveItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const onLoadConfig = (configs: ModelConfig[]) => {
    onConfigChange(configs);
    onClose();
  };

  const onUpdateQuantity = (id: string, newQuantity: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const onCheckout = async (paymentMethod: 'card' | 'paypal') => {
    try {
      setIsLoading(true);
      setSelectedPaymentMethod(paymentMethod);
      setShowShippingModal(true);
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Track checkout initiated event first
      try {
        const trackResponse = await fetch('/api/track-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: 'checkout_initiated',
            metadata: {
              cartItems: cart,
              cartTotal: cart.reduce((total, item) => 
                total + (item.totalPrice * item.quantity), 0)
            }
          }),
        });
        
        if (!trackResponse.ok) {
          console.error('Failed to track checkout event');
        }
      } catch (trackError) {
        console.error('Error tracking checkout event:', trackError);
      }
      
      // Continue with existing checkout process
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cart.map(item => ({
            frameName: item.frameName,
            totalPrice: item.totalPrice,
            quantity: item.quantity,
            frameColor: item.configs.find(config => config.name === 'Frame')?.subParts.find(part => part.name === 'frame_mesh')?.color.label,
            frameSize: item.configs.find(config => config.name === 'Frame')?.nonVisibleOptions?.frameSize.value,
            forkColor: item.configs.find(config => config.name === 'Frame')?.subParts.find(part => part.name === 'fork_mesh')?.color.label,
            handlebarType: item.configs.find(config => config.name === 'Handlebar')?.type || 'N/A',
            handlebarColor: item.configs.find(config => config.name === 'Handlebar')?.subParts.find(part => part.name === 'handlebar_mesh')?.color.label,
            stemColor: item.configs.find(config => config.name === 'Handlebar')?.subParts.find(part => part.name === 'stem_mesh')?.color.label,
            gripColor: item.configs.find(config => config.name === 'Handlebar')?.subParts.find(part => part.name === 'grip_mesh')?.color.label,
            frontWheelType: item.configs.find(config => config.name === 'Front Wheel')?.type || 'N/A',
            frontWheelColor: item.configs.find(config => config.name === 'Front Wheel')?.subParts.find(part => part.name === 'rim')?.color.label,
            rearWheelType: item.configs.find(config => config.name === 'Rear Wheel')?.type || 'N/A',
            rearWheelColor: item.configs.find(config => config.name === 'Rear Wheel')?.subParts.find(part => part.name === 'rim')?.color.label,
            frontTyreType: item.configs.find(config => config.name === 'Front Wheel')?.nonVisibleOptions?.frontTyreType.value,
            frontTyreColor: item.configs.find(config => config.name === 'Front Wheel')?.subParts.find(part => part.name === 'tube')?.color.label,
            rearTyreType: item.configs.find(config => config.name === 'Rear Wheel')?.nonVisibleOptions?.rearTyreType.value,
            rearTyreColor: item.configs.find(config => config.name === 'Rear Wheel')?.subParts.find(part => part.name === 'tube')?.color.label,
            saddleColor: item.configs.find(config => config.name === 'Saddle')?.subParts.find(part => part.name === 'saddleSide_mesh')?.color.label,
            seatPostColor: item.configs.find(config => config.name === 'Saddle')?.subParts.find(part => part.name === 'seatPost_mesh')?.color.label,
            pedalType: item.configs.find(config => config.name === 'Pedals')?.type || 'N/A',
            pedalColor: item.configs.find(config => config.name === 'Pedals')?.subParts.find(part => part.name === 'pedalTread_mesh')?.color.label,
            chainColor: item.configs.find(config => config.name === 'Frame')?.subParts.find(part => part.name === 'chain_mesh')?.color.label,
          })),
          payment_method: selectedPaymentMethod,
          is_international: shippingDestination === 'International'
        }),
      });
      
      const session = await response.json();
      
      if (!session.id) {
        throw new Error('Error creating checkout session');
      }
      
      // Store the Stripe session ID with our tracking event
      await fetch('/api/update-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'checkout_initiated',
          stripeSessionId: session.id
        }),
      });

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        console.error('Stripe is not loaded');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Sorry, an error occurred during checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total price for the entire cart
  const cartTotalPrice = cart.reduce((total, item) => 
    total + (item.totalPrice * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-70" onClick={onClose}></div>
      <div className="relative bg-black text-white w-full max-w-md p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
        {!showShippingModal ? (
          <>
            <h2 className="text-xl font-bold mb-2 border-b pb-4">Your cart</h2>
            {cart.length === 0 ? (
              <p className="py-4 text-center">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-2">
                      <button 
                        className="text-gray-400 mr-2"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        ✕
                      </button>
                      <div className="flex-1">
                        <button 
                          className="text-mangoOrange hover:underline text-left"
                          onClick={() => onLoadConfig(item.configs)}
                        >
                          {item.frameName}
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="px-2 py-1 bg-gray-800 rounded disabled:opacity-50"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          className="px-2 py-1 bg-gray-800 rounded"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="ml-4 min-w-[80px] text-right">
                        £{(item.totalPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 mt-4">
                  <span>Total:</span>
                  <span>£{cartTotalPrice.toFixed(2)}</span>
                </div>
                <div className="mt-6 flex flex-col space-y-3">
                  <button 
                    className="px-6 py-2 bg-mangoOrange text-white rounded-lg hover:bg-orange-600 transition-colors"
                    onClick={() => onCheckout('card')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Checkout'}
                  </button>
                  <button 
                    className="px-6 py-2 bg-[#0070BA] text-white rounded-lg hover:bg-[#005EA6] transition-colors flex items-center justify-center"
                    onClick={() => onCheckout('paypal')}
                    disabled={isLoading}
                  >
                    <span>Checkout with PayPal</span>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.5 2c3.113 0 5.309 1.785 5.863 4.565c1.725 1.185 2.637 3.152 2.637 5.435c0 2.933 -2.748 5.384 -5.783 5.496l-.217 .004h-1.754l-.466 2.8a1.998 1.998 0 0 1 -1.823 1.597l-.157 .003h-2.68a1.5 1.5 0 0 1 -1.182 -.54a1.495 1.495 0 0 1 -.348 -1.07l.042 -.29h-1.632c-1.004 0 -1.914 -.864 -1.994 -1.857l-.006 -.143l.01 -.141l1.993 -13.954l.003 -.048c.072 -.894 .815 -1.682 1.695 -1.832l.156 -.02l.143 -.005h5.5zm5.812 7.35l-.024 .087c-.706 2.403 -3.072 4.436 -5.555 4.557l-.233 .006h-2.503v.05l-.025 .183l-1.2 5a1.007 1.007 0 0 1 -.019 .07l-.088 .597h2.154l.595 -3.564a1 1 0 0 1 .865 -.829l.121 -.007h2.6c2.073 0 4 -1.67 4 -3.5c0 -1.022 -.236 -1.924 -.688 -2.65z" /></svg>
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2 pb-4">Select Shipping Destination</h2>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <button
                  className={`w-full px-6 py-3 border-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-mangoOrange transition-colors ${shippingDestination === 'UK' ? 'border-mangoOrange' : 'border-gray-800'}`}
                  onClick={() => setShippingDestination('UK')}
                >
                  <div className="w-full">
                    <img src="/assets/icons/UKShipping.png" alt="UK Shipping" className="w-full" />
                    Shipping within <br /> United Kingdom
                  </div>
                  <div className="text-mangoOrange text-sm mt-1">Free</div>
                </button>
              </div>
              <div className="w-1/2">
                <button
                  className={`w-full px-6 py-3 border-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-mangoOrange transition-colors ${shippingDestination === 'International' ? 'border-mangoOrange' : 'border-gray-800'}`}
                  onClick={() => setShippingDestination('International')}
                >
                  <div className="w-full">
                    <img src="/assets/icons/InternationalShipping.png" alt="International Shipping" className="w-full" />
                    International <br /> Shipping
                  </div>
                  <div className="text-mangoOrange text-sm mt-1">+ £150</div>
                </button>
              </div>
            </div>
            <div className="mt-6">
              <button
                className="w-full px-6 py-3 bg-mangoOrange text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                onClick={proceedToCheckout}
                disabled={isLoading || !shippingDestination}
              >
                {isLoading ? 'Redirecting...' : 'Continue to Payment'}
              </button>
            </div>
          </>
        )}
        <button 
          className="absolute top-4 right-4"
          onClick={showShippingModal ? () => setShowShippingModal(false) : onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartModal; 