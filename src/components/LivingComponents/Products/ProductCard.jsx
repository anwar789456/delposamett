import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

const ProductCard = ({ image, title, description, priceMin, priceMax, imageObject, products, idProd }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [clickedPoint, setClickedPoint] = useState(null); // State to track clicked point
  const tooltipRef = useRef();

  const handleMouseEnter = (point) => {
    const foundProduct = products.find((product) => product.idProd === point.produitID);
    setHoveredPoint({ product: foundProduct, posX: point.posX, posY: point.posY });
  };

  const handleMouseLeave = () => {
    if (!isTooltipVisible) {
      setHoveredPoint(null);
    }
  };

  const handleHyperPointClick = (event, point) => {
    handleMouseEnter(point);
    setTooltipVisible(true);
    setClickedPoint(point); // Set clicked point to stop animation
  };

  const closeTooltip = () => {
    setHoveredPoint(null);
    setTooltipVisible(false);
    setClickedPoint(null); // Reset clicked point to resume animation
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        closeTooltip();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderHyperPoints = (hyperPoints) => {
    return hyperPoints.map((point, index) => (
      <button
        key={index}
        className={`${styles.hyperPoint} ${clickedPoint === point ? styles.clicked : ''}`}
        style={{ top: `${point.posY}%`, left: `${point.posX}%` }}
        onMouseEnter={() => handleMouseEnter(point)}
        onMouseLeave={handleMouseLeave}
        onClick={(event) => handleHyperPointClick(event, point)}
      />
    ));
  };

  const handleProductClick = () => {
    const recentProducts = JSON.parse(localStorage.getItem('RecentProductsClicked')) || [];
    if (!recentProducts.includes(idProd)) {
      recentProducts.push(idProd);
    }
    localStorage.setItem('RecentProductsClicked', JSON.stringify(recentProducts));
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.imageWrapper}>
        {imageObject && imageObject.length > 0 && imageObject[0].hyperPoints && imageObject[0].hyperPoints.length > 0 ? (
          <>
            <Link href={`/ProductPage/${idProd}`} onClick={handleProductClick}>
              <Image src={image} alt="Product Image" layout="fill" objectFit="cover" className={styles.image} />
            </Link>
            {renderHyperPoints(imageObject[0].hyperPoints)}
          </>
        ) : (
          <Link href={`/ProductPage/${idProd}`} onClick={handleProductClick}>
            <Image src={image} alt="Product Image" layout="fill" objectFit="cover" className={styles.image} />
          </Link>
        )}
        {hoveredPoint && hoveredPoint.product && (
          <div
            ref={tooltipRef}
            className={styles.tooltip}
            style={{ top: `calc(${hoveredPoint.posY}% + 70px)`, left: `calc(${hoveredPoint.posX}% + 70px)` }}
          >
            <Link href={`/ProductPage/${hoveredPoint.product.idProd}`} passHref>
              <div className={styles.tooltipImage}>
                <Image src={hoveredPoint.product.images[0].img} alt={hoveredPoint.product.nom} width={100} height={100} objectFit="cover" />
              </div>
            </Link>
            <button className={styles.closeButton} onClick={closeTooltip}>×</button>
            <div className={styles.tooltipContent}>
              <Link href={`/ProductPage/${hoveredPoint.product.idProd}`} passHref>
                <p className={styles.productName}>{hoveredPoint.product.nom}</p>
              </Link>
              <p className={styles.productPrice}>${hoveredPoint.product.minPrice}</p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <div className={styles.PriceRange}>
          {priceMin === priceMax ? (
            <p className={styles.price}>${priceMin}</p>
          ) : (
            <>
              <p className={styles.price}>${priceMin} -</p>
              <p className={styles.price}>${priceMax}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
