import { useLocation } from 'react-router-dom';

export default function FloatingWhatsApp() {
  const location = useLocation();

  // Don't show on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <a
      href="https://wa.me/2348069196891"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-bounce"
      title="Chat with us on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.124.553 4.194 1.605 6.014L.211 24l6.105-1.602a11.974 11.974 0 0 0 5.715 1.444h.004c6.648 0 12.031-5.383 12.031-12.031S18.679 0 12.031 0zm0 21.84c-1.796 0-3.556-.483-5.097-1.397l-.366-.217-3.788.994.994-3.788-.217-.366A9.98 9.98 0 0 1 2.031 12.03c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.49-7.513c-.301-.151-1.783-.881-2.059-.982-.276-.101-.477-.151-.678.151-.201.302-.779.982-.955 1.183-.176.201-.352.226-.653.075-.301-.151-1.272-.469-2.423-1.496-.896-.8-1.503-1.788-1.679-2.09-.176-.302-.019-.465.132-.616.135-.135.301-.352.452-.528.151-.176.201-.302.301-.503.101-.201.05-.377-.025-.528-.075-.151-.678-1.634-.929-2.237-.245-.589-.494-.509-.678-.518-.176-.008-.377-.011-.578-.011-.201 0-.528.075-.804.377-.276.302-1.055 1.031-1.055 2.514 0 1.483 1.08 2.916 1.231 3.117.151.201 2.125 3.243 5.145 4.546.719.311 1.28.497 1.717.636.722.23 1.38.197 1.898.119.582-.088 1.783-.729 2.034-1.433.251-.704.251-1.307.176-1.433-.075-.126-.276-.201-.578-.352z"/>
      </svg>
    </a>
  );
}
