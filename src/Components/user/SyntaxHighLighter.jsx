import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import PropTypes from 'prop-types';
function SyntaxHighLighter({ jsonString }) {
    return (
        <div className='hightlighter'>
            <SyntaxHighlighter language={"javascript"} style={coy} showLineNumbers>
                {jsonString}
            </SyntaxHighlighter>
        </div>
    )
}
SyntaxHighLighter.propTypes = {
    jsonString: PropTypes.string,
}
export default SyntaxHighLighter
