import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = () => {
  const [files, setFiles] = useState([]);
  const [fileStrings, setFileStrings] = useState([]);
  const [activeElement, setActiveElement] = useState(null);
  const [rowNumber, setRowNumber] = useState(null);
  const [seatNumber, setSeatNumber] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles([...acceptedFiles]);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const fileString = reader.result;
        setFileStrings([...fileStrings, fileString]);
        // fileStringToSVG(fileString);
      };
      reader.readAsText(file);
    });
  }, []);

  const fileStringToSVG = (fileString) => {
    console.log("fromfs", activeElement);
    const svg = document.createElement("div");
    svg.style.height = "70vh";
    svg.innerHTML = fileString;
    svg.querySelector("svg").style.height = "70vh";
    svg.querySelectorAll("circle").forEach((el, idx) => {
      el.setAttribute("data-key", idx);
      if (activeElement?.idx === idx) {
        if (rowNumber) {
          el.setAttribute("data-row-number", rowNumber);
        }
        if (seatNumber) {
          el.setAttribute("data-seat-number", seatNumber);
        }
      }
      el.addEventListener("click", () => {
        setActiveElement({ idx, position: el.getBoundingClientRect() });
      });
    });
    svgRef.current.appendChild(svg);
    // return svg;
  };

  const handleRowChange = (e) => {
    setRowNumber(e.target.value);
  };

  const handleSeatChange = (e) => {
    setSeatNumber(e.target.value);
  };

  const svgRef = useRef();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  fileStrings && fileStrings.forEach((fs) => fileStringToSVG(fs));

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <input placeholder="Row Number" onChange={handleRowChange} />
      <input placeholder="Seat Number" onChange={handleSeatChange} />

      <div ref={svgRef}></div>
      {activeElement && (
        <div
          style={{
            position: "absolute",
            border: "1px solid black",
            width: `${activeElement?.position?.width}px`,
            height: `${activeElement?.position?.height}px`,
            left: `${activeElement?.position?.left}px`,
            top: `${window.scrollY + activeElement?.position?.top}px`
          }}
        ></div>
      )}
      {/* {files.map((f) => (
        <img src={f.preview} />
      ))} */}
    </>
  );
};

export default Dropzone;
