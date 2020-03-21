import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
    const HtmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()))
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
		editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
        wrapperClassName="editor-wrapper"
        editorClassName="editor-editor"
        onEditorStateChange={this.onEditorStateChange}
      />
    )
  }
}
