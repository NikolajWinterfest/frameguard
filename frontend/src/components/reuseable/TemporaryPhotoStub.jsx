const TemporaryPhotoStub = ({ name, image, mwMode }) => {
  return (
    <div
      className={
        image
          ? mwMode
            ? `personcard__photoblock-temporaryphotostub temporaryphotostub invisible mw-mode`
            : `personcard__photoblock-temporaryphotostub temporaryphotostub invisible`
          : mwMode
          ? `personcard__photoblock-temporaryphotostub temporaryphotostub mw-mode`
          : `personcard__photoblock-temporaryphotostub temporaryphotostub`
      }
    >
      <div className="temporaryphotostub__background">
        В НАСТОЯЩЕЕ ВРЕМЯ {name.toUpperCase()} НАХОДИТСЯ НА ФОТОСЕССИИ
      </div>
    </div>
  )
}

export default TemporaryPhotoStub
