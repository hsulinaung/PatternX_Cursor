import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import MeasurementList from "../../shared/components/MeasurementList";
import MeasurementEditor from "../components/MeasurementEditor";
import { getActingCustomer } from "../../auth/activeIdentity";
import { getMeasurementProfile, saveMeasurementProfile } from "../../services/measurementService";
import { loadJourney, saveCustomization, saveJourney } from "../../services/journeyService";
import {
  emptyMeasurements,
  estimateMeasurements,
  normalizeMeasurements,
  sourceLabel,
  validateMeasurements,
} from "../../shared/utils/measurements";

function initialStep(saved, mode) {
  if (mode === "manual") return "manual";
  if (mode === "camera") return "prepare";
  if (mode === "update") return "intro";
  return saved ? "saved" : "intro";
}

export default function MeasurementsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const customer = getActingCustomer();
  const saved = getMeasurementProfile(customer.customerId);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timersRef = useRef([]);
  const [step, setStep] = useState(() => initialStep(saved, params.get("mode")));
  const [values, setValues] = useState(saved?.measurements || emptyMeasurements());
  const [source, setSource] = useState(saved?.source || "manual");
  const [errors, setErrors] = useState({});
  const [cameraError, setCameraError] = useState("");
  const returnTo = params.get("from") === "profile" ? "/profile" : "/customize";

  useEffect(() => {
    return () => {
      stopCamera();
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (step === "camera" && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [step]);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  function setField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function startCamera() {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access isn't available.");
      setStep("manual");
      return;
    }
    const videoBase = { width: { ideal: 720 }, height: { ideal: 1280 } };
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { ...videoBase, facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      streamRef.current = stream;
      setStep("camera");
    } catch {
      setCameraError("Camera access isn't available.");
      setStep("manual");
    }
  }

  function runScan() {
    setStep("scanning");
    const later = (fn, ms) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };
    later(() => setStep("analyzing"), 1600);
    later(() => {
      stopCamera();
      setValues(estimateMeasurements(customer.customerId));
      setSource("camera-estimate");
      setErrors({});
      setStep("review");
    }, 3200);
  }

  function openManual() {
    stopCamera();
    setSource("manual");
    setValues(saved?.measurements || emptyMeasurements());
    setErrors({});
    setStep("manual");
  }

  function persistAndUse(nextValues = values, nextSource = source) {
    const problems = validateMeasurements(nextValues);
    if (Object.keys(problems).length) {
      setErrors(problems);
      return;
    }
    const measurements = normalizeMeasurements(nextValues);
    saveMeasurementProfile({
      customerId: customer.customerId,
      source: nextSource,
      measurements,
    });
    const journey = loadJourney();
    const customization = {
      ...(journey.customization || {}),
      measurements,
      measurementSource: nextSource,
    };
    saveCustomization(customization);
    saveJourney({ customization });
    navigate(returnTo);
  }

  return (
    <PageContainer className="measure-page">
      <p className="eyebrow">AI-assisted measurement</p>
      <h1 className="serif" style={{ fontSize: "2.3rem", marginTop: 4 }}>
        Get your measurements
      </h1>
      <p className="muted">
        Use your camera to let PatternX estimate your body measurements, or enter them manually.
      </p>
      <p className="privacy-note">
        Your camera is used only for the measurement experience. PatternX does not store or share your
        camera feed. Frames are not uploaded.
      </p>

      {step === "saved" ? (
        <Card className="req-card">
          <h2 className="serif">Your saved measurements</h2>
          <p className="muted">
            Last updated {new Date(saved.updatedAt).toLocaleString()} · {sourceLabel(saved.source)}
          </p>
          <MeasurementList measurements={saved.measurements} source={saved.source} title="PatternX Measurement Profile" />
          <div className="hero__actions">
            <Button
              variant="primary"
              onClick={() => persistAndUse(saved.measurements, saved.source)}
            >
              Use These Measurements
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setValues(saved.measurements);
                setStep("intro");
              }}
            >
              Update Measurements
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "intro" ? (
        <Card className="req-card">
          <h2 className="serif">Prepare for your scan</h2>
          <ol className="measure-tips">
            <li>Stand about 2 meters away.</li>
            <li>Make sure your full body is visible.</li>
            <li>Keep your arms slightly away from your body.</li>
            <li>Stand straight, with good lighting.</li>
          </ol>
          <div className="hero__actions">
            <Button variant="primary" onClick={() => setStep("prepare")}>
              Measure with Camera
            </Button>
            <Button variant="secondary" onClick={openManual}>
              Enter Manually
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "prepare" ? (
        <Card className="req-card">
          <h2 className="serif">Position yourself</h2>
          <p>PatternX will open your camera and guide a short scan. This is a demo AI estimate, not a 3D body scan.</p>
          <div className="hero__actions">
            <Button variant="primary" onClick={startCamera}>
              Allow camera
            </Button>
            <Button variant="secondary" onClick={openManual}>
              Enter Measurements Manually
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "camera" ? (
        <Card className="req-card">
          <div className="camera-stage">
            <video ref={videoRef} playsInline muted autoPlay className="camera-video" />
            <svg className="camera-guide" viewBox="0 0 200 360" aria-hidden="true">
              <ellipse cx="100" cy="42" rx="22" ry="24" />
              <path d="M70 78 C70 70 130 70 130 78 L142 170 C144 190 138 200 128 208 L128 250 L118 250 L118 208 L82 208 L82 250 L72 250 L72 208 C62 200 56 190 58 170 Z" />
              <line x1="72" y1="250" x2="68" y2="330" />
              <line x1="128" y1="250" x2="132" y2="330" />
            </svg>
          </div>
          <p className="muted">Stand in the outline. Your camera feed stays on this device.</p>
          <div className="hero__actions">
            <Button variant="gold" onClick={runScan}>
              Start Scan
            </Button>
            <Button variant="secondary" onClick={openManual}>
              Enter Measurements Manually
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "scanning" || step === "analyzing" ? (
        <Card className="req-card" style={{ textAlign: "center" }}>
          <p className="eyebrow">{step === "scanning" ? "Scanning…" : "Analyzing your posture…"}</p>
          <h2 className="serif">
            {step === "scanning" ? "Hold still" : "PatternX is estimating your measurements"}
          </h2>
          <div className="scan-bar" />
        </Card>
      ) : null}

      {step === "review" ? (
        <Card className="req-card">
          <p className="eyebrow">✓ Scan complete</p>
          <h2 className="serif">Your estimated measurements</h2>
          <p>PatternX Measurement Profile · Demo AI estimate</p>
          <p className="muted">
            These measurements are AI estimates. Please review and adjust them before using them for
            your order.
          </p>
          <MeasurementEditor values={values} errors={errors} onChange={setField} estimated />
          <div className="hero__actions">
            <Button variant="primary" onClick={() => persistAndUse()}>
              Use These Measurements
            </Button>
            <Button variant="secondary" onClick={openManual}>
              Enter Manually
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "manual" ? (
        <Card className="req-card">
          <h2 className="serif">Enter measurements</h2>
          {cameraError ? <p className="form-error">{cameraError}</p> : null}
          <MeasurementEditor values={values} errors={errors} onChange={setField} />
          <div className="hero__actions">
            <Button variant="primary" onClick={() => persistAndUse()}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => navigate(returnTo)}>
              Skip for now
            </Button>
          </div>
        </Card>
      ) : null}
    </PageContainer>
  );
}
