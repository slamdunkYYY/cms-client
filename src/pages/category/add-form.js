import React, {Component} from 'react'
import {
	Form,
	Select,
	Input,
} from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
	render() {
		const {parentId,categories} = this.props
		const { getFieldDecorator } = this.props.form;
		return (
			<Form>
				<Item>
				{getFieldDecorator('parentId', {
		          initialValue:parentId
		          })(
					<Select value={parentId}>
						<Option value='0'>Main Level</Option>
						{
							categories.map(c=><Option value={c._id}>{c.name}l</Option>)
						}
					</Select>
				)}
				</Item>
				<Item>
				{getFieldDecorator('categoryName', {
		          initialValue:'',
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
export default Form.create()(AddForm)