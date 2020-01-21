import React from 'react'
import check from 'Common/assets/iconSvg/Check.svg'
import checked from 'Common/assets/iconSvg/checked.svg'

interface Person {
	onClick?: Function;
	type?: Boolean;
	[propName: string]: any;
}

class newRadio extends React.Component<Person, any> {


	checkedFn() {
		if (this.props.page == 'cancel') {
			const { index, item } = this.props
			this.props.onClick(index, item)
		} else {
			this.props.onClick(!this.props.type)
		}

	}
	jsxFn() {
		let { type } = this.props
		if (type != true) {
			return <img src={check} alt="" onClick={() => { this.checkedFn() }} />
		} else {
			return <img src={checked} alt="" onClick={() => { this.checkedFn() }} />
		}
	}
	render() {
		return this.jsxFn()
	}
}

export default newRadio
