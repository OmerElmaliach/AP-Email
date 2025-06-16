function PictureStep({ picture, setPicture, onNext, onBack }) {
  return (
    <div>
      <h2>Upload your picture</h2>
      <input 
        type="file" 
        accept="image/*" 
        onChange={e => setPicture(e.target.files[0])} 
      />
      <button onClick={onBack}>Back</button>
      <button onClick={onNext} disabled={!picture}>Next</button>
    </div>
  );
}

export default PictureStep;
