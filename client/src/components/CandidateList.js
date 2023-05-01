import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CandidateList.css";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [languageFilter, setLanguageFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:7000/candidates")
      .then((response) => {
        setCandidates(response.data.candidates);
        setLanguages(response.data.languages);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Filter candidates by language and experience level
    let filtered = candidates.filter((candidate) => {
      let languageMatches = false;
      let experienceMatches = false;

      if (languageFilter) {
        languageMatches = candidate.languages.some(
          (language) => language == languageFilter
        );
      } else {
        languageMatches = true;
      }

      if (experienceFilter === "junior") {
        experienceMatches =
          !candidate.beginYear ||
          new Date().getFullYear() - candidate.beginYear < 3;
      } else if (experienceFilter === "senior") {
        experienceMatches =
          candidate.beginYear &&
          new Date().getFullYear() - candidate.beginYear >= 3;
      } else {
        experienceMatches = true;
      }

      return languageMatches && experienceMatches;
    });

    // Sort candidates by last update date in descending order
    filtered.sort(
      (a, b) =>
        new Date(b.lastUpdateDate).getTime() -
        new Date(a.lastUpdateDate).getTime()
    );

    setFilteredCandidates(filtered);
  }, [candidates, languageFilter, experienceFilter]);

  return (
    <div className="container-fluid p-0">
      <div className="row bg-primary text-light py-3">
        <div className="col">
          <h1 className="text-center">Candidates</h1>
        </div>
      </div>
      <div className="row bg-light py-3">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <form>
            <div className="mb-3">
              <label htmlFor="language-filter" className="form-label">
                Language:
              </label>
              <select
                id="language-filter"
                className="form-select"
                value={languageFilter}
                onChange={(e) => {
                  setLanguageFilter(e.currentTarget.value);
                }}
              >
                <option value="">All</option>
                {languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="experience-filter" className="form-label">
                Experience:
              </label>
              <select
                id="experience-filter"
                className="form-select"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.currentTarget.value)}
              >
                <option value="">All</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Filter
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div className="candidate-list">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="candidate-card bg-light border border-primary rounded-3 shadow-sm p-3 mb-3"
              >
                <div className="candidate-card-header d-flex align-items-center justify-content-between">
                  <h2 className="candidate-name mb-0">{candidate.name}</h2>
                  <span className="candidate-experience">
                    {candidate.beginYear
                      ? `Experience: ${
                          new Date().getFullYear() - candidate.beginYear
                        } years`
                      : "No experience"}
                  </span>
                </div>
                <div className="candidate-card-body">
                  <ul className="candidate-languages list-unstyled mb-3">
                    {candidate.languages.map((language) => (
                      <li
                        key={language}
                        className="bg-primary text-light rounded-3 px-2 py-1 me-2 mb-2 d-inline-block"
                      >
                        {language}
                      </li>
                    ))}
                  </ul>
                  <span className="candidate-last-update">
                    Last updated:{" "}
                    {new Date(candidate.lastUpdateDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateList;
