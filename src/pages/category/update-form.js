import React, {Component} from 'react'
import {
	Form,
	Input,
} from 'antd'

const Item = Form.Item

class UpdateForm extends Component {
	constructor(props){
        super(props);
		this.props.setForm(this.props.form)
    }
	// componentDidMount() {
	// 	this.props.setForm()
	// }
	render() {
		const categoryName = this.props.categoryName.name
		const { getFieldDecorator } = this.props.form;
		return (
			<Form>
				<Item>
				{getFieldDecorator('categoryName', {
		          initialValue:categoryName,
		          rules: [
	                {required: true, message: 'have to input category name'}
	              ]
		          })(
					<Input placeholder='Please enter name'/>
				)}
				</Item>
			</Form>
		)
	}
}
export default Form.create()(UpdateForm)