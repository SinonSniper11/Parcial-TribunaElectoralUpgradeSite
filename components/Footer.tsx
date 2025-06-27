  import styles from '../styles/Footer.module.css'
  
  export default function Footer() {
    return (
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Tribunal Electoral de Panamá. Todos los derechos reservados.</p>
      </footer>
    )
  }