import "./Hero.css";

import banner1 from "../../../assets/images/banner_Hero1.jpg";
import banner2 from "../../../assets/images/banner_Hero2.jpg";
import banner3 from "../../../assets/images/banner_Hero3.jpg";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation, Autoplay } from "swiper/modules";

export default function Hero() {
  const banners = [
    {
      intro: "INTRODUCING THE NEW",
      title: "Microsoft Xbox 360 Controller",
      type: "Windows XP / 10 / 7 / 8 - PS3 - TV Box",
      btnShop: "Shop Now",
      img: banner1,
    },
    {
      intro: "BEST GAMING ACCESSORIES",
      title: "PlayStation Controller",
      type: "Wireless - Bluetooth - PC & PS5",
      btnShop: "Shop Now",
      img: banner2,
    },
    {
      intro: "LIMITED OFFER",
      title: "Gaming Headset RGB",
      type: "7.1 Surround Sound",
      btnShop: "Shop Now",
      img: banner3,
    },
  ];

  return (
    <section className="hero">
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="hero-card">
              <div className="hero-info">
                <span>{banner.intro}</span>

                <h2>{banner.title}</h2>

                <p>{banner.type}</p>

                <button>{banner.btnShop}</button>
              </div>

              <div className="hero-image">
                <img src={banner.img} alt={banner.title} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
