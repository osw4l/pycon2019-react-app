import React, {Component} from 'react'
import {Col, Row, Table, Chip, Button, Input, Icon, Card} from 'react-materialize';
import axios from "axios/index";
import './Home.css';
import DOMAIN from "../constants";
import SweetAlert from 'sweetalert-react';


export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            categorias_url: `${DOMAIN}/api/categorias/`,
            categorias: [],
            tareas_url: `${DOMAIN}/api/tareas/`,
            tareas_completadas_url: `${DOMAIN}/api/tareas/completadas/`,
            tareas_no_completadas_url: `${DOMAIN}/api/tareas/no_completadas/`,
            tareas: [],
            show_alert_success_send: false,
            loading: false,
            can_send: false,
            descripcion: '',
            categoria: 0
        };
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        this.handleChangeTaskForm = this.handleChangeTaskForm.bind(this);
        this.sendTask = this.sendTask.bind(this);
    }

    componentWillMount() {
        this.getCategories();
        this.getTareas();
    }

    setLoading(val) {
        this.setState({
            loading: val
        });
    }

    getCategories() {
        this.setLoading(true);
        axios.get(this.state.categorias_url, {})
            .then(res => {
                this.setState({
                    categorias: res.data,
                    loading: false
                });
            });
    }

    getTareas() {
        this.setLoading(true);
        axios.get(this.state.tareas_url, {})
            .then(res => {
                this.setState({
                    tareas: res.data,
                    loading: false
                });
            });
    }

    onFilterByCategory(id) {
        this.setLoading(true);
        axios.get(`${DOMAIN}/api/categorias/${id}/tareas/`)
            .then(res => {
                this.setState({
                    tareas: res.data,
                    loading: false
                });
            });
    }


    onFilterByStatus(status) {

        let url = status ? this.state.tareas_completadas_url : this.state.tareas_no_completadas_url;

        this.setLoading(true);
        axios.get(url)
            .then(res => {
                this.setState({
                    tareas: res.data,
                    loading: false
                });
            });
    }

    handleChangeTaskForm(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        let can_send;

        this.setState({
            [name]: value
        });

        if (value.length > 0 && value !== '' && this.state.categoria > 0 && this.state.descripcion.length > 0) {
            can_send = true;
        } else {
            can_send = false;
        }

        this.setState({
            can_send: can_send
        });

    }

    sendTask() {
        let {categoria, descripcion} = this.state;
        axios.post(`${DOMAIN}/api/tareas/`, {categoria, descripcion})
            .then(res => {

                this.setState({
                    descripcion: '',
                    categoria: 0,
                    can_send: false
                });
                this.getTareas();
            });
    }

    onSetStateTask(id){
        axios.put(`${DOMAIN}/api/tareas/${id}/cambiar_estado/`, {})
            .then(res => {
                this.getTareas();
            });
    }

    onDeleteTask(id){
        axios.delete(`${DOMAIN}/api/tareas/${id}/`, {})
            .then(res => {
                this.getTareas();
            });
    }

    render() {
        return (
            <div className="container">
                {/* ALERTS */}
                <SweetAlert
                    show={this.state.show_alert_success_send}
                    type="success"
                    title="Data send successfully"
                    text="your sell was created successfully"
                    onConfirm={() => this.setState({show_alert_success_send: false})}
                />
                <SweetAlert
                    show={this.state.show_alert_stock_empty}
                    type="error"
                    title="insufficient items"
                    text="this products has 0 items"
                    onConfirm={() => this.setState({show_alert_stock_empty: false})}
                />


                <Row className="pull-bottom-20p">

                    <Col m={12}>
                        <Chip onClick={this.getTareas.bind(this)} className="amber darken-2">
                            <span className="text-white">Todas las tareas</span>
                        </Chip>
                        <Chip onClick={this.onFilterByStatus.bind(this, true)} className="light-green darken-1">
                            <span className="text-white">Completadas</span>
                        </Chip>
                        <Chip onClick={this.onFilterByStatus.bind(this, false)} className="red darken-3">
                            <span className="text-white">No completadas</span>
                        </Chip>
                    </Col>

                    <Col m={12}>
                        <p>Categorias</p>
                        {this.state.categorias.map((categoria, index) => {
                            return (
                                <Chip
                                    key={index}
                                    onClick={this.onFilterByCategory.bind(this, categoria.id)}
                                    className={categoria.color}>
                                    <span className="text-white">
                                        {categoria.nombre}
                                    </span>
                                </Chip>
                            )
                        })}

                    </Col>

                    <Col m={8}>
                        {this.state.tareas.length > 0 ?
                            <Table>
                                <thead>
                                <tr>
                                    <th>Descripcion</th>
                                    <th>Estado</th>
                                    <th>Creación</th>
                                    <th>Categoria</th>
                                    <th>
                                        Acciones
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {this.state.tareas.map((tarea, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{tarea.descripcion}</td>
                                            <td>
                                                {tarea.completada}

                                                {tarea.completada ?
                                                    <Icon small className="text-green">done</Icon>
                                                    :
                                                    <Icon small className="text-red">do_not_disturb</Icon>
                                                }

                                            </td>
                                            <td>
                                                {tarea.creacion}
                                            </td>
                                            <td>
                                                <Chip className={"text-white " + tarea.categoria_color}>
                                                    {tarea.categoria_nombre}
                                                </Chip>

                                            </td>
                                            <td>
                                                <Row>

                                                    {tarea.completada ?
                                                        <button
                                                            onClick={this.onSetStateTask.bind(this, tarea.id)}
                                                            className="btn-2 btn-warning btn-xs"  name="action">
                                                            <i className="fa fa-close"></i>
                                                        </button>
                                                        :
                                                        <button
                                                            onClick={this.onSetStateTask.bind(this, tarea.id)}
                                                            className="btn-2 btn-success btn-xs"  name="action">
                                                            <i className="fa fa-check"></i>
                                                        </button>
                                                    }


                                                    <button
                                                        onClick={this.onDeleteTask.bind(this, tarea.id)}
                                                        className="btn-2 btn-danger btn-xs"  name="action">
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </Row>


                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                            :
                            <h1 className="center-align">
                                {this.state.loading ?
                                    'Cargando...' : 'No hay tareas'
                                }
                            </h1>
                        }
                    </Col>

                    <Col m={4}>
                        <Card>
                            <Row className="pull-bottom-20p">
                                <Col m={12}>
                                    <Row className="center-align">
                                        <p>
                                            <strong>
                                                Agregar nueva tarea
                                            </strong>
                                        </p>
                                        <Input s={12}
                                               label="Descripción de la tarea"
                                               limit={20}
                                               name="descripcion"
                                               value={this.state.descripcion}
                                               onChange={this.handleChangeTaskForm}
                                        />
                                        <Input s={12}
                                               type='select'
                                               name="categoria"
                                               defaultValue={this.state.categoria}
                                               onChange={this.handleChangeTaskForm}>
                                            <option value='0' disabled={true}>Seleccione una categoria</option>
                                            {this.state.categorias.map((categoria, index) => {
                                                return (
                                                    <option key={index} value={categoria.id}>{categoria.nombre}</option>
                                                )
                                            })}
                                        </Input>

                                        {this.state.can_send === true &&
                                        <Button s={12}
                                                waves='light'
                                                className="indigo darken-1"
                                                onClick={this.sendTask}
                                        >
                                            Enviar
                                            <Icon right>send</Icon>
                                        </Button>
                                        }


                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                </Row>


            </div>
        )
    }
}
