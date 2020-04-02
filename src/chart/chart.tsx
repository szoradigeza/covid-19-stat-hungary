import React from "react";
  import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  } from 'recharts';
  
interface ChartProp{

}
interface ChartState{
    history_data?: any;
    total_death_max: number;
    active_cases_max: number;
    total_recovered_max: number;
}
export default class Chart extends React.Component<ChartProp, ChartState> {
    componentDidMount() {
        fetch("https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_particular_country.php?country=Hungary", {
	"method": "GET",
	"headers": {
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
		"x-rapidapi-key": "5f04f06ee1msh0243310213af221p114f19jsnd240b83e3a6f"
	}
})
.then(response => response.json())
.then((result) => {
    let country_history_array: any[] =  result.stat_by_country;
    let history_data = [];
    for(let i=0; i<country_history_array.length; i+=20) {
        if(country_history_array[i].new_cases !== '') {
            let splited_date = country_history_array[i].record_date.split('-');
            let day = splited_date[2].split(' ');
            console.log(splited_date);
            country_history_array[i].record_date = splited_date[1] +'-'+ day[0];
            history_data.push(country_history_array[i])
            
        }
    }
            this.setState({total_death_max: Math.max.apply(Math, history_data.map( (o) => { return o.total_deaths ; }))});
            this.setState({active_cases_max: Math.max.apply(Math, history_data.map( (o) => { return o.active_cases ; }))});
            this.setState({total_recovered_max: Math.max.apply(Math, history_data.map( (o) => { return o.total_recovered ; }))});
            console.log(this.state.active_cases_max);
            console.log(this.state.total_death_max);
            console.log(this.state.total_recovered_max);
    this.setState({history_data: history_data});
    console.log(this.state.history_data);
})
.catch(err => {
    console.log(err);
});
    }
    render(){
        if(!this.state){
            return <div><h1>Covid-19</h1></div>
        }
        return(
            <div>
                <p>Active Cases</p>
      <AreaChart
          width={1200}
          height={150}
          data={this.state.history_data}
          syncId="anyId"
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="record_date" />
          <YAxis domain={[0, this.state.active_cases_max]}/>
          <Tooltip />
          <Area type="monotone" dataKey="active_cases" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
        <p>Total deths</p>
        <AreaChart
          width={1200}
          height={150}
          data={this.state.history_data}
          syncId="anyId"
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="record_date"/>
          <YAxis type="number" domain={[0, this.state.total_death_max]}/>
          <Tooltip />
          <Area type="monotone" dataKey="total_deaths" stroke="#ff0040" fill="#ff0000" />
        </AreaChart>
        <p>Total recovered</p>
        <AreaChart
          width={1200}
          height={150}
          data={this.state.history_data}
          syncId="anyId"
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="record_date" />
          <YAxis domain={[0, this.state.total_recovered_max]}/>
          <Tooltip />
          <Area type="monotone" dataKey="total_recovered" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
            </div>
        )
    }
}