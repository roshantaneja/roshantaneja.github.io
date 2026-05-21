import styles from '../../styles/mission-control.module.css';
import heroConfig from '../../data/hero.json';

export default function LatestDispatch({ post }) {
  if (!post) return null;

  return (
    <div className={styles.tile}>
      <p className={styles.tileLabel}>{heroConfig.dispatch.label}</p>
      <div className={styles.tileBody}>
        <a
          href={`${heroConfig.dispatch.urlPrefix}${post.slug}`}
          className={styles.dispatchTitle}
        >
          {post.title}
        </a>
        {post.date && (
          <p className={styles.dispatchDate}>{post.date}</p>
        )}
        {post.excerpt && (
          <p className={styles.dispatchExcerpt}>{post.excerpt}&hellip;</p>
        )}
      </div>
    </div>
  );
}
