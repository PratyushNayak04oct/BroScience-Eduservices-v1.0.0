const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d548.899503916079!2d84.88726843416742!3d22.257487518645572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a201d066aae4473%3A0xc36cabf058d13c3e!2sBRO_SCIENCE%20INSTITUTE!5e0!3m2!1sen!2sin!4v1787427102060!5m2!1sen!2sin";

export default function CampusMap({ className = "h-64 w-full", title = "BRO SCIENCE INSTITUTE location" }) {
  return (
    <iframe
      src={MAP_SRC}
      title={title}
      className={className}
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
