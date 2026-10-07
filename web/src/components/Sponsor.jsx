import styles from './Sponsor.module.css';
import produbanco1 from '../assets/logos/AuspiciaProdubanco1.png';

export default function Sponsor({ className = '' }) {
  return (
    <div className={`${styles.sponsor} ${className}`}>      
      <img src={produbanco1} width="220px" className={styles.imageProdubanco} />
    </div>
  );
}
