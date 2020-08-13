/* eslint-disable import/extensions */
import React from 'react';
import lightbox from './lightbox.css';
import PrevArrow from './PrevArrow.jsx';
import NextArrow from './NextArrow.jsx';
import X from './X.jsx';
import ShareIcon from './ShareIcon.jsx';
import LikeIcon from './LikeIcon.jsx';

const Lightbox = ({
  toggle, next, prev, images, selected, height, width
}) => (
  <div className={lightbox.container}>
    <div className={lightbox.grid} height={height} width={width}>
      <div className={lightbox.close}>
        <button className={lightbox.button} type="submit" onClick={toggle} id="close">
          <span className={lightbox.x}>
            <X />
          </span>
          Close
        </button>
      </div>
      <div className={lightbox.selected}>
        {`${selected} / ${images.length}`}
      </div>
      <div className={lightbox.share}>
        <ShareIcon />
        <LikeIcon />
      </div>
      <div className={lightbox.carousel}>
        <PrevArrow prev={prev} selected={selected} />
        {images.map((image) => <img className={selected === image.img_order ? lightbox.image : lightbox.imageOff} src={image.url} alt="" key={image.id} />)}
        <NextArrow next={next} selected={selected} length={images.length} />
      </div>
    </div>
  </div>
);

export default Lightbox;
