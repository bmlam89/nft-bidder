const HorizontalSlider = (props) => {
  return (
    <div
      key='horizontal-slider-wrapper'
      id='horizontal-slider-wrapper'
      className={ `flex snap-x overflow-x-auto overscroll-x-contain gap-x-2 hSlider ${props.horizontalSliderWrapperClassname}` }
    >
      { props.children }
    </div>
  )
};

export default HorizontalSlider;