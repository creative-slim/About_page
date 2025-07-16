
const CameraDebug = ({ camera }) => {
    const logCameraPosition = () => {
        if (camera) {
            console.log('Camera Position:', camera.position);
            console.log('Camera Rotation:', camera.rotation);
        } else {
            console.log('Camera not available yet.');
        }
    };

    return (
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 100 }}>
            <button onClick={logCameraPosition}>Log Camera Position</button>
        </div>
    );
};

export default CameraDebug; 