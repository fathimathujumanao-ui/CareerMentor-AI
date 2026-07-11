import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [careerResult, setCareerResult] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeResult, setResumeResult] = useState("");

  const [loadingCareer, setLoadingCareer] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);

  const [targetJob, setTargetJob] = useState("");
  const [skillGapResult, setSkillGapResult] = useState("");
  const [loadingSkillGap, setLoadingSkillGap] = useState(false);

  const [interviewJob, setInterviewJob] = useState("");
  const [interviewResult, setInterviewResult] = useState("");
  const [loadingInterview, setLoadingInterview] = useState(false);

  // Career Advice
  const getAdvice = async () => {
    setLoadingCareer(true);
    setCareerResult("");

    try {
      const response = await fetch("http://localhost:8000/career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills,
          interests,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        setCareerResult((prev) => prev + chunk);
      }
    } catch (error) {
      setCareerResult("Something went wrong.");
    }

    setLoadingCareer(false);
  };

  // Resume Upload
  const uploadResume = async () => {
    if (!resumeFile) {
      alert("Please select a resume.");
      return;
    }

    setLoadingResume(true);
    setResumeResult("");

    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const response = await fetch("http://localhost:8000/resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResumeResult(data.analysis);
    } catch (error) {
      setResumeResult("Resume analysis failed.");
    }

    setLoadingResume(false);
  };

  const analyzeSkillGap = async () => {
    if (!targetJob.trim()) {
      alert("Please enter a target job.");
      return;
    }

    setLoadingSkillGap(true);
    setSkillGapResult("");

    try {
      const response = await fetch("http://localhost:8000/skill-gap", {
        method: "POST",
        headers: {
         "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeResult,
          target_job: targetJob,
        }),
      });

      const data = await response.json();
      setSkillGapResult(data.analysis);
    }   catch (error) {
    setSkillGapResult("Skill gap analysis failed.");
    }

    setLoadingSkillGap(false);
  };

  const generateInterview = async () => {
    if (!interviewJob.trim()) {
      alert("Please enter a target job.");
      return;
    }

    setLoadingInterview(true);
    setInterviewResult("");

    try {
      const response = await fetch("http://localhost:8000/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_job: interviewJob,
        }),
      });

      const data = await response.json();

      setInterviewResult(data.questions);
    }   catch (error) {
          setInterviewResult("Interview preparation failed.");
        } finally {
            setLoadingInterview(false);
        }
  };

  const downloadPDF = async () => {
  try {
    const response = await fetch("http://localhost:8000/download-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        career: careerResult,
        resume: resumeResult,
        skill_gap: skillGapResult,
        interview: interviewResult,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "CareerMentor_Report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);
    alert("Failed to download PDF.");
  }
};

  return (
    <div className="page">
      <div className="backdrop" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      <div className="shell">
        <header className="hero">
          <span className="eyebrow">AI Career Copilot</span>
          <h1 className="brand">
            Career<span className="brand-accent">Mentor</span> AI
          </h1>
          <p className="tagline">
            One guided path from where you are to the role you want &mdash;
            advice, resume review, skill gaps and interview prep in a single
            workspace.
          </p>
        </header>


        

        <ol className="journey">
          {/* Step 01 — Career Recommendation */}
          <li className="step">
            <div className="step-marker">
              <span className="step-index">01</span>
              <span className="step-line" aria-hidden="true" />
            </div>

            <section className="card">
              <div className="card-head">
                <h2>Career Recommendation</h2>
                <p>Tell us what you know and what you love doing.</p>
              </div>

              <div className="field-grid">
                <div className="field">
                  <label htmlFor="skills">Your skills</label>
                  <input
                    id="skills"
                    type="text"
                    placeholder="e.g. Python, SQL, communication"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="interests">Your interests</label>
                  <input
                    id="interests"
                    type="text"
                    placeholder="e.g. data, design, mentoring"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={getAdvice}
                disabled={loadingCareer}
              >
                {loadingCareer && <span className="spinner" />}
                {loadingCareer ? "Generating..." : "Get Career Advice"}
              </button>

              {careerResult && (
                <div className="result">
                  <ReactMarkdown>{careerResult}</ReactMarkdown>
                </div>
              )}
            </section>
          </li>

          {/* Step 02 — Resume Analysis */}
          <li className="step">
            <div className="step-marker">
              <span className="step-index">02</span>
              <span className="step-line" aria-hidden="true" />
            </div>

            <section className="card">
              <div className="card-head">
                <h2>Resume Analysis</h2>
                <p>Upload your resume for a straight-talking review.</p>
              </div>

              <label className="dropzone" htmlFor="resume-upload">
                <div className="dropzone-icon">📄</div>
                <div className="dropzone-text">
                  <strong>
                    {resumeFile ? resumeFile.name : "Click to choose a file"}
                  </strong>
                  <span>PDF, DOC or DOCX</span>
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </label>

              <button
                className="btn btn-primary"
                onClick={uploadResume}
                disabled={loadingResume}
              >
                {loadingResume && <span className="spinner" />}
                {loadingResume ? "Analyzing..." : "Upload Resume"}
              </button>

              {resumeResult && (
                <div className="result">
                  <ReactMarkdown>{resumeResult}</ReactMarkdown>
                </div>
              )}
            </section>
          </li>

          {/* Step 03 — Skill Gap Analysis */}
          <li className="step">
            <div className="step-marker">
              <span className="step-index">03</span>
              <span className="step-line" aria-hidden="true" />
            </div>

            <section className="card">
              <div className="card-head">
                <h2>Skill Gap Analysis</h2>
                <p>See what stands between you and the role you want.</p>
              </div>

              <div className="field">
                <label htmlFor="target-job">Target job</label>
                <input
                  id="target-job"
                  type="text"
                  placeholder="e.g. AI Engineer"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={analyzeSkillGap}
                disabled={loadingSkillGap}
              >
                {loadingSkillGap && <span className="spinner" />}
                {loadingSkillGap ? "Analyzing..." : "Analyze Skill Gap"}
              </button>

              {skillGapResult && (
                <div className="result">
                  <ReactMarkdown>{skillGapResult}</ReactMarkdown>
                </div>
              )}
            </section>
          </li>

          {/* Step 04 — Interview Preparation */}
          <li className="step step-last">
            <div className="step-marker">
              <span className="step-index">04</span>
            </div>

            <section className="card">
              <div className="card-head">
                <h2>Interview Preparation</h2>
                <p>Practice with questions tailored to the role.</p>
              </div>

              <div className="field">
                <label htmlFor="interview-job">Target job</label>
                <input
                  id="interview-job"
                  type="text"
                  placeholder="e.g. AI Engineer"
                  value={interviewJob}
                  onChange={(e) => setInterviewJob(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={generateInterview}
                disabled={loadingInterview}
              >
                {loadingInterview && <span className="spinner" />}
                {loadingInterview
                  ? "Generating..."
                  : "Generate Interview Questions"}
              </button>

              {interviewResult && (
                <div className="result">
                  <ReactMarkdown>{interviewResult}</ReactMarkdown>
                </div>
              )}
            </section>
          </li>
        </ol>

        <div className="report-bar">
          <div className="report-copy">
            <strong>Ready to wrap up?</strong>
            <span>Bundle everything above into one shareable PDF.</span>
          </div>
          <button className="btn btn-accent" onClick={downloadPDF}>
            Download Complete Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

<footer className="footer">

<h2>CareerMentor AI</h2>

<p>

Built using React • FastAPI • Groq • Docker

</p>

<p>

© 2026

</p>

</footer>

export default App;