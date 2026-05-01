export const projects = [
  {
    slug: "english-janala",
    title: "English Janala Vocabulary",
    image: "/project-1.jpg",
    summary:
      "A modern vocabulary learning web app designed to help users improve English word knowledge through interactive learning, meanings, and practice tools.",
    tags: ["HTML", "CSS", "Tailwind", "DaisyUI", "Javascript", "API"],
    description:
      "A clean and user-friendly vocabulary learning platform that helps users expand their English vocabulary through structured learning methods. The app includes features like word exploration, meanings, examples, and interactive practice tools. The interface is designed for simplicity and accessibility, ensuring users can easily navigate and focus on learning. Built with performance and scalability in mind, it provides a smooth experience across devices",
    liveUrl: "https://englishjanalavocabulary.vercel.app/",
    githubClientUrl: "https://github.com/kayesmahmud30/English-Janala",
    challenges: [
      "Structuring vocabulary data efficiently",
      "Designing intuitive UI for learning",
      "Maintaining performance with dynamic data",
      "Making the learning experience engaging",
    ],
    improvements: [
      "Add user authentication (login/signup)",
      "Add progress tracking system",
      "Add spaced repetition system (SRS)",
      "Add pronunciation/audio support",
      "Add AI-based suggestions",
      "Add gamification features",
    ],
  },
  {
    slug: "digitools-shop",
    title: "DigiTools Shop",
    image: "/project-2.jpg",
    summary:
      "An e-commerce web application that allows users to browse products, add items to cart, and experience a modern online shopping interface",
    tags: ["React", "Tailwind", "DaisyUI", "React Toastify"],
    description:
      "Digitools Shop is a modern e-commerce web application designed to simulate a real-world online shopping experience. Users can explore products, view details, and interact with a clean and responsive interface. The application focuses on usability, smooth navigation, and a visually appealing layout. It demonstrates core e-commerce functionalities while maintaining performance and simplicity.",
    liveUrl: "https://digitools-shop.vercel.app/",
    githubClientUrl: "https://github.com/kayesmahmud30/PH-Web-13-Assignment-06",
    challenges: [
      "Managing cart state effectively",
      "Designing a user-friendly shopping interface",
      "Handling product data dynamically",
      "Ensuring responsiveness across screen sizes",
    ],
    improvements: [
      "Add user authentication (login/signup)",
      "Integrate payment gateway system",
      "Add backend and database (Node.js, MongoDB)",
      "Implement order management system",
      "Add product filtering and search",
      "Improve security and validation",
    ],
  },
  {
    slug: "payoo-bank",
    title: "Payoo Bank",
    image: "/project-3.jpg",
    summary:
      "A digital banking web application that simulates real-world financial operations like adding money, transferring funds, and managing transactions.",
    tags: ["HTML", "CSS", "DaisyUI", "Font Awesome", "JavaScript", "DOM"],
    description:
      "Payoo Bank is a modern digital banking simulation web application that allows users to perform common financial operations such as adding balance, withdrawing money, transferring funds, and viewing transaction history. The application focuses on providing a clean UI and a realistic banking experience for learning and demonstration purposes. It is designed to mimic real-world mobile financial services and online banking systems.",
    liveUrl: "https://kayesmahmud30.github.io/Payoo-Bank/",
    githubClientUrl: "https://github.com/kayesmahmud30/Payoo-Bank",
    challenges: [
      "Handling dynamic balance updates correctly",
      "Managing transaction state without a backend",
      "Ensuring proper validation for financial inputs",
      "Designing a realistic banking UI experience",
    ],
    improvements: [
      "Add backend integration (Node.js / Express)",
      "Add database support (MongoDB)",
      "Implement user authentication system",
      "Add real-time transaction updates",
      "Improve security and validation",
      "Add mobile app version",
    ],
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}
