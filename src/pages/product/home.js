import React, {Component} from 'react'
import {
	Card,
	Button,
	Icon,
	Select,
	Input,
	Table,
	message
} from 'antd'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

export default class ProductHome extends Component {
	constructor(props){
        super(props);
		this.initColumns()
    }

    state = {
    	total:0,
    	products:[],
    	loading: false,
    	searchType:"productName",
    	searchName:""
    }

    initColumns = () => {
		this.columns = [
		 {
		    title: 'Name',
		    dataIndex: 'name',
		  },
		  {
		    title: 'Description',
			dataIndex: 'desc',
		  },
		  {
		  	title: 'Price',
		  	dataIndex: 'price',
		  	render:(price) => {
		  		return ("$"+price)
		  	}
		  },
		{
        width: 100,
        title: '状态',
        render: (product) => {
			const {status, _id} = product
          	const newStatus = status===1 ? 2 : 1
			return (
	            <span>
	              <Button
	                type='primary'
	                onClick={() => this.updateStatus(_id, newStatus)}
	              >
	                {status===1?"Out of Stock":"In Stock"}
	              </Button>
	              <div>{status===1?"In Stock":"Out of Stock"}</div>
	            </span>
          )
        }
      },
		  {
		    title: 'Action',
		    width: 300,
			render: (product) => {
				return (
					<span>
			          <Button type="link" onClick={() => {this.props.history.push("/product/detail",{product})}}>Detail</Button>
			          <Button type="link" onClick={() => {this.props.history.push("/product/addupdate",product)}}>Update</Button>
					</span>
      			)
			}		  
		  },
		]
	}

	getProducts= async (pageNum)=> {
		this.pageNum=pageNum
		this.setState({loading:true})
		const {searchName,searchType} = this.state
		let result
		if (!searchName) {
			result = await reqProducts(pageNum,PAGE_SIZE)
		}
		else {
      		result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
		}
		this.setState({loading:false})
			if (result.status===0) {
				const products = result.data.list
				const {total} = result.data
				this.setState({
					products,
					total
				})
			}
			else {
				message.error("get product failed")
			}	
	}

	updateStatus = async (productId, newStatus)=> {
		const result = await reqUpdateStatus(productId, newStatus)
	    if(result.status===0) {
	      message.success('update success')
	      this.getProducts(this.pageNum)
	    }
	}
	componentDidMount() {
		this.getProducts(1)
	}

	render() {
		const {products, total, loading, searchType, searchName} = this.state
		const title = (
			<span>
				<Select 
				value={searchType}
				style={{width:150}}
				onChange={value=>{this.setState({searchType:value})}}
				>
					<Option value="productName">Search by Name</Option>
					<Option value="productDesc">Search by Description</Option>
				</Select>
				<Input 
				placeholder="content" 
				style={{width: 150, margin: '0 15px'}} 
				onChange={(e)=>{this.setState({searchName:e.target.value})}}
				/>
				<Button type="primary" onClick={()=>{this.getProducts(1)}}><Icon type='plus'/>Search</Button>
			</span>
		)
		const extra = (
			<Button type="primary" onClick={()=>{this.props.history.push("/product/addupdate")}}>Add New</Button>
		)
		return (
		<Card title={title} extra={extra}>
			<Table
				dataSource={products}
				columns={this.columns}
				loading= {loading}
				bordered
				rowKey='_id'
				pagination={{
					current: this.pageNum,
				    total,
					defaultPageSize: PAGE_SIZE,
					showQuickJumper: true,
					onChange: this.getProducts
				    }}
          			>
			</Table>
		</Card>
		)
	}
}