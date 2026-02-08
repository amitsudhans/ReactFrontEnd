const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© 2026 My Company. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    padding: "10px",
    background: "#1e293b",
    color: "#fff",
    textAlign: "center",
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
};

export default Footer;
