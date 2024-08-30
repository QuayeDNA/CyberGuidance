import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    quote:
      "E-Counselling has been a lifesaver for me. The counselors are incredibly supportive and understanding.",
    image: "https://picsum.photos/150/150?random=1",
    name: "John Doe",
    faculty: "Faculty of Engineering",
  },
  {
    quote:
      "The career guidance I received was top-notch and helped me secure a great internship.",
    image: "https://picsum.photos/150/150?random=2",
    name: "Jane Smith",
    faculty: "Faculty of Business",
  },
  {
    quote:
      "The personal development sessions have greatly boosted my confidence and skills.",
    image: "https://picsum.photos/150/150?random=3",
    name: "Samuel Green",
    faculty: "Faculty of Arts",
  },
  {
    quote:
      "I highly recommend E-Counselling for anyone needing mental health support.",
    image: "https://picsum.photos/150/150?random=4",
    name: "Emily Johnson",
    faculty: "Faculty of Science",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <section id="testimonials" className="py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="w-full  lg:px-16">
          <h2 className="text-xl text-left font-bold text-gray-700 mb-12">
            Testimonials
          </h2>
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className="text-md lg:text-lg italic text-gray-700 mb-4 text-center">
                  <span className="text-2xl lg:text-4xl text-black font-bold">
                    “
                  </span>
                  {testimonial.quote}
                  <span className="text-2xl lg:text-4xl text-black font-bold">
                    ”
                  </span>
                </p>
                <div className="flex items-center mb-4 justify-center text-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-md text-gray-600">
                      {testimonial.faculty}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
