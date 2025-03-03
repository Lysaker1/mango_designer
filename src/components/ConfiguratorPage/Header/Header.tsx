import { useEffect, useState } from "react";
import { ParameterDefinition } from "../ParameterPanel/parameterDefintions";
import { colors, ModelConfig } from "../Viewer/defaults";
import { Grid } from "../ParameterPanel/parameterTypes/Grid/Grid";
import BackgroundColorModal from "./BackgroundColorModal/BackgroundColorModal";
import { Color } from "../ParameterPanel/parameterTypes/ColorPicker";
import FrameSelectorModal from "./FrameSelectorModal/FrameSelectorModal";
import CartModal, { CartItem } from "./CartModal/CartModal";
import { getDefaultConfigForFrame } from '@/utils/componentManager';

const CUSTOM_FEE = 50;

const Header = ({configs, onConfigChange, onBackgroundColorChange}: {configs: ModelConfig[], onConfigChange: (newConfigs: ModelConfig[]) => void, onBackgroundColorChange: (color: string) => void}) => {
  const [frameName, setFrameName] = useState<string>("");
  const [framePrice, setFramePrice] = useState<number>(0); 
  const [showBikeSelector, setShowBikeSelector] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(colors.mangoOrange.hex); // Default mango orange
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Get background color from local storage or set default
  useEffect(() => {
    const storedColor = localStorage.getItem('configurator-background');
    if (storedColor) {
      setBackgroundColor(storedColor);
      onBackgroundColorChange(storedColor);
    } else {
      localStorage.setItem('configurator-background', colors.mangoOrange.hex);
    }
  }, []);

  const handleColorChange = (color: Color) => {
    setBackgroundColor(color.hex);
    onBackgroundColorChange(color.hex);
    localStorage.setItem('configurator-background', color.hex);
  }

  const frameParameter: ParameterDefinition = {
    id: 'frameType',
    name: 'Type',
    type: 'grid',
    value: '/models/Mango_OSS_Frame.glb',
    options: [
      { label: 'OSS', value: '/models/Mango_OSS_Frame.glb', price: 429.99 }, 
      { label: 'Moosher', value: '/models/Mango_Moosher_Frame.glb', price: 429.99 },
      { label: 'OG', value: '/models/Mango_OG_Frame.glb', price: 529 }, 
      { label: 'DOG', value: '/models/Mango_DOG_Frame.glb', price: 649 }, 
    ],
    category: 'Frame',
    model: 'Frame',
  };

  useEffect(() => {
    setFrameName(configs[0].type);
    setFramePrice(frameParameter.options?.find(option => option.label === configs[0].type)?.price || 0); 
  }, [configs])

  const handleFrameChange = (value: string, type: string, price: number) => {
    // Get the default configuration for the new frame type
    const defaultConfig = getDefaultConfigForFrame(type);
    
    // Update all components based on the new frame
    const updatedConfigs = configs.map((config) => {
      if (config.name === "Frame") {
        return { ...config, path: value, type, price };
      }
      
      // Update front wheel
      if (config.name === "Front Wheel") {
        const frontWheel = defaultConfig.wheels.front;
        return { 
          ...config, 
          path: frontWheel.path, 
          type: frontWheel.type,
          price: frontWheel.price 
        };
      }
      
      // Update rear wheel
      if (config.name === "Rear Wheel") {
        const rearWheel = defaultConfig.wheels.rear;
        return { 
          ...config, 
          path: rearWheel.path, 
          type: rearWheel.type,
          price: rearWheel.price 
        };
      }
      
      // Update handlebar
      if (config.name === "Handlebar") {
        const handlebar = defaultConfig.handlebar;
        return {
          ...config,
          path: handlebar.path,
          type: handlebar.type,
          price: handlebar.price
        };
      }
      
      return config;
    });
    
    onConfigChange(updatedConfigs);
    setShowBikeSelector(false);
  };

  useEffect(() => {
    const nonVisibleOptionsPrice = configs.reduce((acc, config) => {
      if (!config.nonVisibleOptions) return acc;
      return acc + Object.values(config.nonVisibleOptions).reduce((sum, option) => sum + (option.price || 0), 0);
    }, 0);
    
    const configPrices = configs.slice(1).reduce((acc, config) => acc + (config.price || 0), 0);
    const total = framePrice + configPrices + nonVisibleOptionsPrice + CUSTOM_FEE;
    setTotalPrice(total);
  }, [configs]);

  const addToCart = () => {
    const newItem: CartItem = {
      id: Date.now().toString(), // Unique ID
      configs: JSON.parse(JSON.stringify(configs)), // Copy of current configs
      totalPrice: totalPrice,
      quantity: 1,
      frameName: `Custom ${frameName}`
    };
    setCart([...cart, newItem]);
    setShowCart(true); // Show cart after adding item
  };

  // Count total number of items in the cart
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      <header className="h-16 px-4 flex items-center justify-between bg-black backdrop-blur-md">
        <div className="flex items-center relative">
          <button 
            id="bike-selector-button"
            className="text-white text-xl font-bold flex items-center justify-center gap-2"
            onClick={() => setShowBikeSelector(!showBikeSelector)}
          >
            Change bike
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
            </svg>
          </button>
        </div>
          
        <div className="flex items-center">
          <div 
            className="text-white text-sm mr-4 font-bold text-xl relative group flex items-center justify-center"
          >
            <span className='mr-1'>£</span>
            {totalPrice.toFixed(2)}
            <span 
              className="ml-2 cursor-pointer"             
              onMouseEnter={() => setShowPriceDetails(true)}
              onMouseLeave={() => setShowPriceDetails(false)}
            >
              <svg fill="white" height={18} width={18} xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 512">
                <path fillRule="nonzero" d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.7-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.3 28.66 185.31 0 256 0zm17.75 342.25h29.15v29.32h-93.79v-29.32h28.76v-92.34h-28.76v-29.32h64.64v121.66zm-27.94-150.37c-7.08-.05-13.12-2.53-18.2-7.56-5.08-5.01-7.56-11.11-7.56-18.25 0-7.01 2.48-13.06 7.56-18.08 5.08-5.02 11.12-7.55 18.2-7.55 6.95 0 12.99 2.53 18.08 7.55 5.13 5.02 7.67 11.07 7.67 18.08 0 4.72-1.2 9.07-3.56 12.94-2.36 3.93-5.45 7.07-9.31 9.37-3.87 2.3-8.17 3.45-12.88 3.5zm171.9-97.59C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.33 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.38 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z"/>
              </svg>
            </span>
          </div>
            
          <button 
            id="color-picker-button"
            className="w-6 h-6 rounded-full cursor-pointer"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="100%"
              height="100%"
            >
              <g fill="none">
                <path
                  fill={colors.mangoOrange.hex}
                  d="M2.75 12A9.25 9.25 0 0 0 12 21.25V2.75A9.25 9.25 0 0 0 2.75 12"
                ></path>
                <path
                  stroke={colors.mangoOrange.hex}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 21.25a9.25 9.25 0 0 0 0-18.5m0 18.5a9.25 9.25 0 0 1 0-18.5m0 18.5V2.75"
                ></path>
              </g>
            </svg>
          </button>
          
          <button 
            className="ml-4 relative text-white cursor-pointer"
            onClick={() => setShowCart(!showCart)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-mangoOrange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
            
          <button 
            className="ml-4 px-6 py-2 text-sm font-medium text-white border border-mangoOrange bg-mangoOrange rounded-lg hover:bg-black transition-colors"
            onClick={addToCart}
          >
            Add to cart
          </button>
        </div>
      </header>

      {/* Frame Selector Modal */}
      {showBikeSelector && (
        <div>
          <FrameSelectorModal 
            isOpen={showBikeSelector} 
            onClose={() => setShowBikeSelector(false)} 
            value={configs[0].path} 
            onChange={(value, type, price) => {
              // This will still be called, but we'll primarily use onFullConfigChange
              // for the actual configuration updates
            }}
            onFullConfigChange={onConfigChange}
            configs={configs}
            frameParameter={frameParameter}
            frameType={configs[0].type as string}
          />
        </div>
      )}

      {/* Background Color Modal */}
      {showColorPicker && 
        <div>
          <BackgroundColorModal 
            isOpen={showColorPicker} 
            onClose={() => setShowColorPicker(false)} 
            value={backgroundColor} 
            onChange={handleColorChange} 
          />
        </div>
      }

      {/* Price Details Modal */}
      {showPriceDetails && (
        <div className="absolute top-20 right-[137px] transform w-64 p-4 space-y-2 bg-black bg-opacity-95 backdrop-blur-md rounded-2xl shadow-lg z-20 text-white">
          <div className="text-lg font-bold border-b pb-2 mb-2 flex justify-between">
            <span>{frameName}:</span>
            <span>£{framePrice.toFixed(2)}</span>
          </div>
          <div className="text-sm">
            <div className="flex justify-between py-1">
              <span>+ Custom fee</span>
              <span>£{CUSTOM_FEE.toFixed(2)}</span>
            </div>
            {configs.filter(config => config.name !== 'Frame').map((config, idx) => 
              config.price && (
                <div key={idx} className="flex justify-between py-1">
                  <span>+ {config.type}</span>
                  <span>£{config.price.toFixed(2)}</span>
                </div>
              )
            )}
            {configs.filter(config => config.name !== 'Frame').map((config, idx) => 
              config.nonVisibleOptions && Object.entries(config.nonVisibleOptions).map(([key, value], changeIdx) => 
                value.price && (
                  <div key={`${idx}-${changeIdx}`} className="flex justify-between py-1">
                    <span>+ {value.value}</span>
                    <span>£{value.price.toFixed(2)}</span>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}

      {/* Handlekurv Modal */}
      {showCart && (
        <CartModal
          onClose={() => setShowCart(false)}
          cart={cart}
          setCart={setCart}
          onConfigChange={onConfigChange}
        />
      )}
    </>
  )
}

export default Header;