/**
 * 54Helper 信息编解码
 */
new Vue({
	el: '#pageContainer',
	data: {
		selectedType: 'coreValuesEncode',
		sourceContent: '',
		resultContent: ''
	},

	mounted: function() {
		this.$refs.srcText.focus();
	},

	methods: {
		convert: function() {
			this.$nextTick(() => {

				let tools = Tarp.require('./endecode-lib');

				if(this.selectedType === 'coreValuesEncode') {
					this.resultContent = tools.coreValuesEncode(this.sourceContent);
				} else if(this.selectedType === 'coreValuesDecode') {
					this.resultContent = tools.coreValuesDecode(this.sourceContent.replace(/\\U/g, '\\u'));
				}
			});
		},

		clear: function() {
			this.sourceContent = '';
			this.resultContent = '';
		},

		getResult: function() {
			this.$refs.rstCode.select();
		}
	}
});