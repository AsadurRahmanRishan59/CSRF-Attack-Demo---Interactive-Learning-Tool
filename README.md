# 🔐 CSRF Attack Demo - Interactive Learning Tool

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-demo.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

> An interactive, visual demonstration of CSRF (Cross-Site Request Forgery) attacks and how to prevent them. Perfect for learning, teaching, or understanding web security concepts.

[**🚀 Live Demo**](https://your-demo.vercel.app) | [**📖 Blog Post**](link-to-your-blog)

![Demo Screenshot](https://via.placeholder.com/800x400?text=Add+Screenshot+Here)

## 🎯 What is this?

Ever wondered how CSRF attacks actually work? This interactive demo lets you:

- ✅ See a CSRF attack in action (safely!)
- ✅ Understand why cookies alone aren't secure
- ✅ Learn how CSRF tokens provide protection
- ✅ Compare vulnerable vs protected implementations side-by-side

**No backend required** - everything runs in your browser!

## 🚨 The Problem

When you're logged into a website, your browser automatically sends cookies with every request. Attackers exploit this by tricking your browser into making requests to sites where you're authenticated.

```javascript
// Attacker's hidden code on evilsite.com
fetch('https://yourbank.com/transfer', {
  method: 'POST',
  credentials: 'include', // Browser sends your cookies!
  body: JSON.stringify({ to: 'attacker', amount: 1000 })
});
```

**Your browser doesn't care** that the request came from a malicious site - it just sends the cookies. 😱

## 🛡️ The Solution

The **double-submit cookie pattern**:

1. Generate a CSRF token on login
2. Store it in a readable cookie
3. Require the token in a custom header
4. Validate: cookie value === header value

**Why this works:** Attackers can force the browser to send cookies, but they **cannot read cookies** to copy the token into a header (blocked by Same-Origin Policy).

## ✨ Features

- 🎮 **Interactive Demo** - Click buttons to simulate attacks
- 👀 **Real-time Logs** - See exactly what's being sent
- 🔄 **Side-by-side Comparison** - Vulnerable vs Protected
- 📚 **Step-by-step Explanations** - Understand what's happening
- 🎨 **Beautiful UI** - Built with React + Tailwind CSS
- 📱 **Responsive** - Works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/csrf-demo.git

# Navigate to the project
cd csrf-demo

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` and start exploring!

## 📦 Deploy to Vercel

The easiest way to deploy this demo:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/csrf-demo)

Or manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🎓 How to Use

1. **Start with the Vulnerable Site**
   - Click "Login" on YourBank.com
   - Launch the CSRF attack from EvilSite.com
   - Watch your balance decrease!

2. **Switch to the Protected Site**
   - Login again (notice the CSRF token)
   - Try the same attack
   - Watch it get blocked!

3. **Read the Logs**
   - See what cookies and headers are sent
   - Understand why the attack succeeds or fails

## 🏗️ Project Structure

```
csrf-demo/
├── src/
│   ├── components/
│   │   └── CSRFDemo.jsx       # Main demo component
│   ├── App.jsx                # App entry point
│   └── index.css              # Tailwind styles
├── public/
├── package.json
└── README.md
```

## 🧠 Key Concepts Explained

### Why Cookies Are the Problem

Browsers automatically attach cookies to requests - even cross-origin requests. This is convenient for users but dangerous for security.

### Why Headers Are the Solution

Browsers **only send custom headers** if your JavaScript explicitly adds them. Attackers can't add headers from their malicious sites (blocked by CORS).

### The Double-Submit Pattern

```javascript
// On login, generate token
const csrfToken = crypto.randomUUID();
cookies.set('XSRF-TOKEN', csrfToken, { httpOnly: false });

// Client sends token in header
fetch('/api/transfer', {
  headers: { 'X-CSRF-TOKEN': csrfToken },
  credentials: 'include'
});

// Server validates
if (cookieToken !== headerToken) {
  return 403; // Forbidden
}
```

## 📚 Learn More

### Related Resources

- [OWASP CSRF Guide](https://owasp.org/www-community/attacks/csrf)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [My Blog Post on CSRF](link-to-your-blog)

### When You DO Need CSRF Protection

- ✅ Cookies sent automatically by browser
- ✅ Session-based authentication
- ✅ Cookie-based JWT storage

### When You DON'T Need CSRF Protection

- ❌ JWT in Authorization headers only (not cookies)
- ❌ Stateless APIs without cookies
- ❌ Server-to-server communication

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions

- [ ] Add more attack scenarios
- [ ] Add SameSite cookie demonstration
- [ ] Add XSS comparison demo
- [ ] Add backend implementation examples
- [ ] Improve mobile responsiveness
- [ ] Add more languages/translations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by real-world security challenges
- Built to help developers understand CSRF attacks
- Thanks to the web security community

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)
- Blog: [yourblog.com](https://yourblog.com)

## ⭐ Show Your Support

If this project helped you understand CSRF attacks, please give it a ⭐️!

## 📮 Feedback

Have questions or suggestions? [Open an issue](https://github.com/yourusername/csrf-demo/issues) or reach out!

---

<p align="center">Made with ❤️ and ☕ by developers, for developers</p>
<p align="center">
  <sub>Security should be understood, not feared</sub>
</p>
