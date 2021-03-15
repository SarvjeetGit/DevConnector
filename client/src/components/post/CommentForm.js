import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = ({ addComment, postId }) => {
    const [text, setText] = useState('');

    return (
        <div class='post-form'>
            <div class='bg-primary p'>
                <h3>Leave a comment</h3>
            </div>
            <form
                class='form my-1'
                onSubmit={(e) => {
                    e.preventDefault();
                    addComment(postId, { text });
                    setText('');
                }}
            >
                <textarea
                    name='text'
                    cols='30'
                    rows='5'
                    value={text}
                    placeholder='Create a post'
                    required
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
                <input type='submit' class='btn btn-dark my-1' value='Submit' />
            </form>
        </div>
    );
};

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
