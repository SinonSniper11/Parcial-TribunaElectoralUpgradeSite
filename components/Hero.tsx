import styles from '../styles/Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1>Tribunal Electoral de Panamá</h1>
        <p>¡Garantizando tus derechos y la democracia!</p>
      </div>
    </section>
  )
}