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

  const onCheckout = async () => {
    try {
      console.log('Checking out');
      setIsLoading(true);
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
        }),
      });
      const session = await response.json();
      
      if (!session.id) {
        throw new Error('Error creating checkout session');
      }
  
      console.log('Stripe publishable key', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

      if (!stripe) {
        throw new Error('Could not load Stripe');
      } else {
        console.log(stripe);
      }
      
      await stripe.redirectToCheckout({ sessionId: session.id });
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

            <div className="mt-6 flex justify-end">
              <button 
                className="px-6 py-2 bg-mangoOrange text-white rounded-lg hover:bg-orange-600 transition-colors"
                onClick={onCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Go to checkout'}
              </button>
            </div>
          </>
        )}
        
        <button 
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartModal; 