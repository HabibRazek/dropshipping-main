"use client"

import Lottie from 'react-lottie';

function OrderConfirmedGif() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: '/public/assets/order-confirmed-animation.json',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };
    
      return (
        <div>
          <h1>Check out this cool animation!</h1>
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      );
}

export default OrderConfirmedGif;
