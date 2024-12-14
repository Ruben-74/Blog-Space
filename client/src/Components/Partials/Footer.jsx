import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2024 BlogSpace. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <a href="/privacy-policy" className="footer-link">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="footer-link">
            Terms of Service
          </a>
          <a href="/contact" className="footer-link">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
