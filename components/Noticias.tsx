import styles from '../styles/Noticias.module.css'
import noticias from '../data/noticias.json'

export default function Noticias() {
  return (
    <section className={styles.noticias}>
      <h2>Noticias</h2>
      <div className={styles.list}>
        {noticias.map((noticia: any) => (
          <div className={styles.card} key={noticia.id}>
            <img src={noticia.img} alt={noticia.titulo} />
            <h3>{noticia.titulo}</h3>
            <p>{noticia.resumen}</p>
          </div>
        ))}
      </div>
    </section>
  )
}