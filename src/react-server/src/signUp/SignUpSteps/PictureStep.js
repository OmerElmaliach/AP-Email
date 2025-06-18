import '../SignUpStepsStyle/PictureStep.css'

function PictureStep({ picture, setPicture, onNext, onBack }) {
  return (
    <div className="input-container">
      <h2 className="step-title">Upload your picture</h2>

      <div className="upload-box">
        <label htmlFor="picture-upload" className="upload-label">
          Choose Image
        </label>
        <input 
          id="picture-upload"
          type="file" 
          accept="image/*" 
          className="upload-input"
          onChange={e => setPicture(e.target.files[0])} 
        />
      </div>

      <div className="button-row">
        <button className="btn btn-primary rounded-pill" onClick={onBack}>
          Back
        </button>
        <button 
          className="btn btn-primary rounded-pill" 
          onClick={onNext} 
          disabled={!picture}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PictureStep;