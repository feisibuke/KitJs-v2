/**
 * @module areaV2
 * @requires module:service/area
 * @desc 地址模块v2 支持三级地址
 * @author gangzhao,cassiesu,addisonxue
 */
var arealib = {
	area : window.T_AREA || {},

	defaultDistrict : window.T_FENZ || [],

	shipLocation : {
		'110000' : [ '北京', '8', '2001', '110000', '110108', '3792', '0', '3792_131' ],
		'120000' : [ '天津', '8', '2001', '120000', '120100', '120101', '0', '2860_2858' ],
		'130000' : [ '河北', '8', '2001', '130000', '130100', '130181', '0', '816_814' ],
		'140000' : [ '山西', '8', '2001', '140000', '140100', '140181', '0', '2492_2490' ],
		'150000' : [ '内蒙古', '8', '2001', '150000', '150100', '150122', '0', '2018_2016' ],
		'210000' : [ '辽宁', '10', '2001', '210000', '210100', '210181', '0', '5671_1900' ],
		'220000' : [ '吉林', '10', '2001', '220000', '220100', '220104', '0', '1832_1830' ],
		'230000' : [ '黑龙江', '10', '2001', '230000', '230100', '230112', '0', '1001_999' ],
		'310000' : [ '上海', '2', '1', '310000', '310100', '310104', '0', '2626_2621' ],
		'320000' : [ '江苏', '1', '1', '320000', '320100', '320103', '0', '1601_1591' ],
		'330000' : [ '浙江', '1', '1', '330000', '330100', '330105', '3227', '3227_3225' ],
		'340000' : [ '安徽', '1', '1', '340000', '340100', '340102', '3', '3_1' ],
		'350000' : [ '福建', '15', '1001', '350000', '350100', '350181', '0', '5150_201' ],
		'360000' : [ '江西', '3', '3001', '360000', '360100', '360102', '0', '1720_1718' ],
		'370000' : [ '山东', '9', '2001', '370000', '370200', '370202', '0', '2342_2329' ],
		'410000' : [ '河南', '11', '3001', '410000', '410100', '410181', '0', '3490_1144' ],
		'420000' : [ '湖北', '3', '3001', '420000', '420100', '420102', '1325', '1325_1323' ],
		'430000' : [ '湖南', '12', '3001', '430000', '430100', '5457', '0', '5162_1454' ],
		'440000' : [ '广东', '6', '1001', '440000', '440100', '440103', '0', '421_403' ],
		'440100' : [ '广州', '6', '1001', '440000', '440100', '440104', '0', '3763_403' ],
		'440200' : [ '韶关', '6', '1001', '440000', '440200', '440281', '0', '442_403' ],
		'440300' : [ '深圳', '7', '1001', '440000', '440300', '440304', '0', '421_403' ],
		'440400' : [ '珠海', '6', '1001', '440000', '440400', '440403', '0', '429_403' ],
		'440500' : [ '汕头', '7', '1001', '440000', '440500', '440515', '433', '433_403' ],
		'440600' : [ '佛山', '6', '1001', '440000', '440600', '440606', '0', '493_403' ],
		'440700' : [ '江门', '6', '1001', '440000', '440700', '440781', '0', '485_403' ],
		'440800' : [ '湛江', '6', '1001', '440000', '440800', '440881', '0', '506_403' ],
		'440900' : [ '茂名', '6', '1001', '440000', '440900', '440981', '0', '516_403' ],
		'441200' : [ '肇庆', '6', '1001', '440000', '441200', '441283', '523', '523_403' ],
		'441300' : [ '惠州', '7', '1001', '440000', '441300', '470', '0', '470_403' ],
		'441400' : [ '梅州', '7', '1001', '440000', '441400', '441481', '0', '461_403' ],
		'441500' : [ '汕尾', '7', '1001', '440000', '441500', '441581', '0', '476_403' ],
		'441600' : [ '河源', '7', '1001', '440000', '441600', '441624', '0', '454_403' ],
		'441700' : [ '阳江', '6', '1001', '440000', '441700', '441702', '504', '504_403' ],
		'441800' : [ '清远', '6', '1001', '440000', '441800', '441881', '0', '532_403' ],
		'441900' : [ '东莞', '7', '1001', '440000', '441900', '481', '0', '481_403' ],
		'442000' : [ '中山', '6', '1001', '440000', '442000', '483', '0', '483_403' ],
		'445100' : [ '潮州', '7', '1001', '440000', '445100', '445121', '0', '541_403' ],
		'445200' : [ '揭阳', '7', '1001', '440000', '445200', '445281', '0', '545_403' ],
		'445300' : [ '云浮', '6', '1001', '440000', '445300', '445381', '0', '551_403' ],
		'450000' : [ '广西', '15', '1001', '450000', '450100', '450109', '0', '601_556' ],
		'460000' : [ '海南', '7', '1001', '460000', '460100', '460105', '5537', '5537_789' ],
		'500000' : [ '重庆', '4', '4001', '500000', '500100', '500103', '0', '182_158' ],
		'510000' : [ '四川', '13', '4001', '510000', '510100', '510181', '0', '6505_2652' ],
		'520000' : [ '贵州', '4', '4001', '520000', '520100', '520181', '0', '695_693' ],
		'530000' : [ '云南', '13', '4001', '530000', '530100', '530181', '0', '3560_3077' ],
		'540000' : [ '西藏', '13', '4001', '540000', '540100', '540121', '0', '2998_2996' ],
		'610000' : [ '陕西', '5', '5001', '610000', '610100', '5053', '0', '5053_2212' ],
		'620000' : [ '甘肃', '5', '5001', '620000', '620100', '620102', '0', '5763_299' ],
		'630000' : [ '青海', '5', '5001', '630000', '630100', '630123', '0', '2162_2160' ],
		'640000' : [ '宁夏', '5', '5001', '640000', '640100', '640121', '0', '2132_2130' ],
		'650000' : [ '新疆', '14', '5001', '650000', '650100', '650102', '0', '2880_2878' ]
	},

	rebuildarea : null,

	selectFill : function(select, json) {
		if (select == undefined)
			return;
		select = this.getSelectDom(select);
		if (json) {
			try {
				select.options.length = 0;
			} catch (e) {
				for (var i = 0, a = select.options; i < a.length; i++) {
					a[i].remove();
				}
			}
			for (var j = 0; j < json.length; j++) {
				var opt = new Option(json[j].name, json[j].value);
				if (json[j].selected == true) {
					opt.selected = true;
				}
				select.options.add(opt);
			}
		}
	},

	getSelectDom : function(select) {
		if (!select.nodeName && select.selector) {
			return select[0];
		} else {
			return select;
		}
	},

	createProvList : function(o) {
		var selected = o.selected;
		var wrapper = o.wrapper || document.body
		var el = wrapper.querySelectorAll('.J_prov');
		var tmpList = this.rebuildarea;
		var provList = [];
		for (i in this.rebuildarea) {
			if (this.rebuildarea[i].title == "prov") {
				if (this.rebuildarea[i].id == selected) {
					provList.push({
						name : this.rebuildarea[i].name,
						value : this.rebuildarea[i].id,
						selected : true
					});
				} else {
					provList.push({
						name : this.rebuildarea[i].name,
						value : this.rebuildarea[i].id,
					});
				}
			}
		}

		for (var i = 0; i < el.length; i++) {
			this.selectFill(el[i], provList);
		}

	},

	createCityList : function(o) {
		var prov_id = o.prov_id;
		var selected = o.selected;
		var wrapper = o.wrapper || document.body
		var el = wrapper.querySelectorAll('.J_city');
		var tmpList = this.rebuildarea;
		var cityList = [];
		for (i in this.rebuildarea) {
			if (this.rebuildarea[i].title == "city" && this.rebuildarea[i].parentId == prov_id) {
				if (this.rebuildarea[i].id == selected) {
					cityList.push({
						name : this.rebuildarea[i].name,
						value : this.rebuildarea[i].id,
						selected : true
					});
				} else {
					cityList.push({
						name : this.rebuildarea[i].name,
						value : this.rebuildarea[i].id,
					});
				}
			}
		}

		for (var i = 0; i < el.length; i++) {
			this.selectFill(el[i], cityList);
		}
	},

	createAreaList : function(o) {
		var city_id = o.city_id;
		var selected = o.selected;
		var wrapper = o.wrapper || document.body
		var el = wrapper.querySelectorAll('.J_area');
		var tmpList = this.rebuildarea;
		var areaList = [];
		for (i in this.rebuildarea) {
			if (this.rebuildarea[i].title == "district" && this.rebuildarea[i].parentId == city_id) {
				if (this.rebuildarea[i].id == selected) {
					areaList.push({
						name : this.rebuildarea[i].name,
						value : this.rebuildarea[i].id,
						selected : true
					});
				} else {
					areaList.push({
						name : this.rebuildarea[i].name,
						value : this.rebuildarea[i].id,
					});
				}
			}
		}

		for (var i = 0; i < el.length; i++) {
			this.selectFill(el[i], areaList);
		}
	},

	setPrid : function(district) {
		if (this.rebuildarea == null) {
			this.rebuilddata();
		}
		var _current_area = this.rebuildarea[district];
		var _current_city = this.rebuildarea[_current_area.parentId];
		var _current_prov = this.rebuildarea[_current_city.parentId];

		$.cookie.add('prid', _current_area + '_' + _current_prov, '/', 86400 * 365, "yixun.com");
	},

	getWsid : function(json, callback) {
		var noShip = true;
		if (json.provName && json.provName != null && json.provName != '') {
			step1();
		} else if (json.district) {
			step2();
		}

		function step1() {
			var res;
			for (var i = 0; i < arealib.defaultDistrict.length; i++) {
				var o = arealib.defaultDistrict[i];
				if (json.provName.indexOf(o.name) == 0) {
					noShip = false;
					callback && callback(o.siteId);
					break;
				}
			}
			if (noShip) {
				callback && callback(null);
			}
		}
		function step2() {
			for ( var i in arealib.shipLocation) {
				var addr = arealib.getAddress(json.district);
				var ship = arealib.shipLocation[i];
				if (addr.prov.indexOf(ship[0] == 0)) {
					noShip = false;
					callback && callback(ship[2]);
					return false;
				}
			}
			if (noShip) {
				callback && callback(null);
			}
		}
	},

	getDefaultDistrict : function(provName, callback) {
		var res;
		for (var i = 0; i < this.defaultDistrict.length; i++) {
			var o = this.defaultDistrict[i];
			if (provName.indexOf(o.name) == 0) {
				res = this.getAddress(o.district);
				res.siteId = o.siteId;
				break;
			}
		}
		callback && callback(res);
	},

	getAddress : function(district) {
		if (this.rebuildarea == null) {
			this.rebuilddata();
		}
		var _current_area = this.rebuildarea[district];
		var _current_city = this.rebuildarea[_current_area.parentId];
		var _current_prov = this.rebuildarea[_current_city.parentId];
		var res = {};
		res.prov = _current_prov.name;
		res.prov_key = _current_prov.id;
		res.city = _current_city.name;
		res.city_key = _current_city.id;
		res.area = _current_area.name;
		res.area_key = _current_area.id;

		return res;
	},

	getAddressText : function(district, split) {
		split = split || '';
		if (this.rebuildarea == null) {
			this.rebuilddata();
		}
		var _current_area = this.rebuildarea[district];
		var _current_city = this.rebuildarea[_current_area.parentId];
		var _current_prov = this.rebuildarea[_current_city.parentId];
		var res = [];
		res.push(_current_prov.name);
		if (_current_prov.name != _current_city.name) {
			res.push(_current_city.name);
		}
		res.push(_current_area.name);

		return res.join(split);
	},

	rebuilddata : function() {
		var areamap = [];
		for (i in this.area) {
			var provobj = this.area[i]
			areamap[provobj.id] = provobj;
			areamap[provobj.id].title = "prov";
			for (j in provobj.city) {
				var cityobj = provobj.city[j];
				areamap[cityobj.id] = cityobj;
				areamap[cityobj.id].parentId = provobj.id;
				areamap[cityobj.id].title = "city";
				for (k in cityobj.district) {
					var districtobj = cityobj.district[k];
					areamap[districtobj.id] = districtobj;
					areamap[districtobj.id].parentId = cityobj.id;
					areamap[districtobj.id].title = "district";
				}
			}

		}
		window['T_AREA_REBUILD'] = this.rebuildarea = areamap;
	},

	init : function(o) {
		var district, wrapper;
		if (typeof o == 'string') {
			district = o;
			wrapper = document.body;
		} else {
			district = o.district;
			wrapper = o.wrapper || document.body
		}
		var _current_area = district || 0;
		var _current_prov = 0;
		var _current_city = 0;

		if (this.rebuildarea == null) {
			this.rebuilddata();
		}

		_current_area = this.rebuildarea[district] || this.rebuildarea[2626];
		_current_city = this.rebuildarea[_current_area.parentId];
		_current_prov = this.rebuildarea[_current_city.parentId];

		//初始化下拉菜单
		this.createProvList({
			selected : _current_prov.id,
			wrapper : wrapper
		});
		this.createCityList({
			prov_id : _current_prov.id,
			selected : _current_city.id,
			wrapper : wrapper
		});
		this.createAreaList({
			city_id : _current_city.id,
			selected : _current_area.id,
			wrapper : wrapper
		});
		//
		/**
		 * 绑定更改省的下拉菜单
		 * @return {[type]} [description]
		 */
		var p = this;
		wrapper.querySelector('.J_prov').onchange = function() {
			p.createCityList({
				prov_id : wrapper.querySelector('.J_prov').value,
				wrapper : wrapper
			});
			p.createAreaList({
				city_id : wrapper.querySelector('.J_city').value,
				wrapper : wrapper
			});
		}
		/**
		 * 绑定更改城市下拉菜单
		 * @return {[type]} [description]
		 */
		wrapper.querySelector('.J_city').onchange = function() {
			p.createAreaList({
				city_id : wrapper.querySelector('.J_city').value,
				wrapper : wrapper
			});
		};
	}
}