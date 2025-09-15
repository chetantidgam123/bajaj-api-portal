import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import PropTypes from "prop-types";

const EditableBody = ({ curl, onChange }) => {
  return (
    <div className="border-request" style={{ height: "300px" }}>
      <AceEditor
        mode="sh"
        theme="monokai"
        value={typeof curl === "string" ? curl : ""} 
        onChange={(value) => onChange(value)} 
        fontSize={14}
        width="100%"
        height="100%"
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
    </div>
  );
};

EditableBody.propTypes = {
  curl: PropTypes.string, 
  onChange: PropTypes.func.isRequired,
};

export default EditableBody;
