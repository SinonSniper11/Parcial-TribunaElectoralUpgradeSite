import styles from '../styles/Servicios.module.css'
import servicios from '../data/servicios.json'

export default function Servicios() {
  return (
    <section className={styles.servicios}>
      <h2>Servicios Destacados</h2>
      <div className={styles.grid}>
        {servicios.map((servicio: any) => (
          <div className={styles.card} key={servicio.id}>
            <img src={servicio.icono} alt={servicio.nombre} />
            <h3>{servicio.nombre}</h3>
            <p>{servicio.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  )
}