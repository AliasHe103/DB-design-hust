import {useRef, useState} from "react";
import home from './home.svg';
import {motion} from 'framer-motion'
//     1） 新生入学信息增加，学生信息修改。<br>
//     2） 课程信息维护（增加新课程，修改课程信息，删除没有选课的课程信息）。<br>
//     3） 录入学生成绩，修改学生成绩。<br>
//     4） 按系统计学生的平均成绩、最好成绩、最差成绩、优秀率、不及格人数。<br>
//     5） 按系对学生成绩进行排名，同时显示出学生、课程和成绩信息。<br>
//     6） 输入学号，显示该学生的基本信息和选课信息。<br>

const handleSelect = async (cmd) => {
    if (typeof cmd !== "string") return null;
    const keys = [];
    const retObj = await window.expose.select(cmd);
    if (retObj) {
        for (let key in retObj[0]) {
            keys.push(key);
        }
    }
    else {
        return null;
    }
    return  (
        <table className={"selectedTable"}>
            <tbody>
            <tr>
                {keys.map(key => <td>{key}</td>)}
            </tr>
            </tbody>
            {retObj.map(item => (
                <tr>
                    {keys.map(key => <td>{item[key]}</td>)}
                </tr>
            ))}
        </table>
    );
}

//1)新生入学信息增加，学生信息修改
function Menu1() {
    const [result, setResult] = useState('欢迎');
    const [status, setStatus] = useState('initial');
    const [resultTable, setResultTable] = useState(null);
    const snoRef = useRef(null);
    const handleBtn1 = async () => {
        setStatus('select');
        const table = await handleSelect("select * from student");
        if (!table) {
            setResult('还没有学生信息！');
        }
        else {
            setResultTable(table);
        }
    }
    const handleBtn2 = async () => {
        setStatus('add');
    }
    const handleBtn3 = async () => {
        setStatus('modify');
    }
    const handleInsert = async (e) => {
        e.preventDefault();
        const formData = await new FormData(e.target);
        const formValue = [];
        for (let [, value] of formData.entries()) {
            formValue.push(value);
        }
        const ret = await window.expose.insert(formValue, 'student');
        console.log (ret);
        setResult(ret);
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = await new FormData(e.target);
        const formValue = [];
        for (let [key, value] of formData.entries()) {
            if (key !== 'Sno') {
                formValue.push(value);
                console.log(value);
                console.log(typeof value);
            }
        }
        if (!formData.get('Sno')) {
            setResult('请检查学号是否输入正确');
            return;
        }
        formValue.push(formData.get('Sno'));
        const ret = await window.expose.update(formValue, 'student');
        setResult(ret);
    }
    const handleDelete = async () => {
        const sno = snoRef.current.value;
        if (!sno) {
            setResult('请检查学号是否输入正确');
            return;
        }
        const ret = await window.expose.delete(sno, 'student');
        console.log (ret);
        setResult(ret);
    }
    const formTable = (
        <table className={"insertTable"}>
            <tbody>
            <tr>
                <td>Sno</td> <td>Sname</td> <td>Ssex</td> <td>Sage</td> <td>Sdept</td> <td>Scholarship</td>
            </tr>
            <tr>
                <td><input type={"text"} name={"Sno"} ref={snoRef}/></td>
                <td><input type={"text"} name={"Sname"}/></td>
                <td style={{display: "flex", flexDirection: "column", justifyContent: "flex-end"}}><select name={"Ssex"}><option value={"男"}>男</option><option value={"女"}>女</option></select></td>
                <td><input type={"number"} name={"Sage"}/></td>
                <td><input type={"text"} name={"Sdept"}/></td>
                <td><input type={"text"} name={"Scholarship"}/></td>
            </tr>
            </tbody>
        </table>
    );
    return (
        <div className={"menu1"}>
            {status === 'add' &&
                <form onSubmit={handleInsert}>
                    {formTable}
                    <button type={'submit'} className={"menu1Btn submitBtn"}>提交</button>
                </form>
            }
            {status === 'modify' &&
                <form onSubmit={handleUpdate}>
                    {formTable}
                    <button type={'submit'} className={"menu1Btn submitBtn"}>修改</button>
                    <button type={'button'} className={"menu1Btn deleteBtn"} onClick={handleDelete} formNoValidate>删除</button>
                </form>
            }
            <div className={"resultText text"}>
                {result}
            </div>
            <div className={"resultTable"}>
                {status === 'select' && resultTable}
            </div>
            <div className={"menu1Buttons"}>
                <button className={"menu1Btn"} onClick={handleBtn1}>查看学生信息</button>
                <button className={"menu1Btn"} onClick={handleBtn2}>新增学生信息</button>
                <button className={"menu1Btn"} onClick={handleBtn3}>修改学生信息</button>
            </div>
        </div>
    );
}

//2)课程信息维护（增加新课程，修改课程信息，删除没有选课的课程信息）
function Menu2() {
    const [result, setResult] = useState('欢迎');
    const [status, setStatus] = useState('initial');
    const [resultTable, setResultTable] = useState(null);
    const cnoRef = useRef(null);
    const handleBtn1 = async () => {
        setStatus('select');
        const table = await handleSelect("select * from course");
        if (!table) {
            setResult('还没有课程信息！');
        }
        else {
            setResultTable(table);
        }
    }
    const handleBtn2 = async () => {
        setStatus('add');
    }
    const handleBtn3 = async () => {
        setStatus('modify');
    }
    const handleInsert = async (e) => {
        e.preventDefault();
        const formData = await new FormData(e.target);
        const formValue = [];
        for (let [, value] of formData.entries()) {
            formValue.push(value);
        }
        const ret = await window.expose.insert(formValue, 'course');
        console.log (ret);
        setResult(ret);
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = await new FormData(e.target);
        const formValue = [];
        for (let [key, value] of formData.entries()) {
            if (key !== 'Cno') {
                formValue.push(value);
                console.log(value);
                console.log(typeof value);
            }
        }
        if (!formData.get('Cno')) {
            setResult('请检查课程号是否输入正确');
            return;
        }
        formValue.push(formData.get('Cno'));
        const ret = await window.expose.update(formValue, 'course');
        setResult(ret);
    }
    const handleDelete = async () => {
        const cno = cnoRef.current.value;
        if (!cno) {
            setResult('请检查课程号是否输入正确');
            return;
        }
        const ret = await window.expose.delete(cno, 'course');
        console.log (ret);
        setResult(ret);
    }
    const formTable = (
        <table className={"insertTable"}>
            <tbody>
            <tr>
                <td>Cno</td> <td>Cname</td> <td>Cpno</td> <td>Ccredit</td>
            </tr>
            <tr>
                <td><input type={"text"} name={"Cno"} ref={cnoRef}/></td>
                <td><input type={"text"} name={"Cname"}/></td>
                <td><input type={"text"} name={"Cpno"}/></td>
                <td><input type={"number"} name={"Ccredit"}/></td>
            </tr>
            </tbody>
        </table>
    );
    return (
        <div className={"menu2"}>
            {status === 'add' &&
                <form onSubmit={handleInsert}>
                    {formTable}
                    <button type={'submit'} className={"menu2Btn submitBtn"}>提交</button>
                </form>
            }
            {status === 'modify' &&
                <form onSubmit={handleUpdate}>
                    {formTable}
                    <button type={'submit'} className={"menu1Btn submitBtn"}>修改</button>
                    <button type={'button'} className={"menu1Btn deleteBtn"} onClick={handleDelete} formNoValidate>删除</button>
                </form>
            }
            <div className={"resultText text"}>
                {result}
            </div>
            <div className={"resultTable"}>
                {status === 'select' && resultTable}
            </div>
            <div className={"menu1Buttons"}>
                <button className={"menu1Btn"} onClick={handleBtn1}>查看课程信息</button>
                <button className={"menu1Btn"} onClick={handleBtn2}>新增课程信息</button>
                <button className={"menu1Btn"} onClick={handleBtn3}>修改课程信息</button>
            </div>
        </div>
    );
}

//3) 录入学生成绩，修改学生成绩
//4) 按系统计学生的平均成绩、最好成绩、最差成绩、优秀率、不及格人数
//5) 按系对学生成绩进行排名，同时显示出学生、课程和成绩信息
//6) 输入学号，显示该学生的基本信息和选课信息
function Menu3() {
    const [result, setResult] = useState('欢迎');
    const [status, setStatus] = useState('initial');
    const [resultTable, setResultTable] = useState(null);
    const snoRef = useRef(null);
    const cnoRef = useRef(null);

    const handleBtn1 = async () => {
        setStatus('select');
        const table = await handleSelect("select * from sc");
        if (!table) {
            setResult('还没有课程信息！');
        }
        else {
            setResultTable(table);
        }
    }
    const handleBtn2 = async () => {
        setStatus('add');
    }
    const handleBtn3 = async () => {
        setStatus('modify');
    }
    const handleInsert = async (e) => {
        e.preventDefault();
        const formData = await new FormData(e.target);
        const formValue = [];
        for (let [, value] of formData.entries()) {
            formValue.push(value);
        }
        const ret = await window.expose.insert(formValue, 'sc');
        console.log (ret);
        setResult(ret);
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = await new FormData(e.target);
        const formValue = [];
        formValue.push(formData.get('Grade'));
        if (!formData.get('Sno') || !formData.get('Cno')) {
            setResult('请检查学号或课程号是否输入正确');
            return;
        }
        formValue.push(formData.get('Sno'));
        formValue.push(formData.get('Cno'));
        const ret = await window.expose.update(formValue, 'sc');
        setResult(ret);
    }
    const handleDelete = async () => {
        const sno = snoRef.current.value;
        const cno = cnoRef.current.value;
        if (!sno || !cno) {
            setResult('请检查学号或课程号是否输入正确');
            return;
        }
        const ret = await window.expose.delete([sno, cno], 'sc');
        console.log (ret);
        setResult(ret);
    }
    const handleOverview = async () => {
        setStatus('select');
        const ret = await handleSelect(
            `select s.sdept,
                avg(sc.grade) as avg_grade,max(sc.grade) as max_grade,min(sc.grade) as min_grade,
                round(sum(case when sc.grade >= 90 then 1 else 0 end) * 1.0 / count(*), 2) as excellent_rate,
                sum(case when sc.grade < 60 then 1 else 0 end) as fail_count
                from student s join sc on s.sno = sc.sno join course c on sc.cno = c.cno
                group by s.sdept;`
        );
        setResultTable(ret);
    }
    const handleRank = async () => {
        setStatus('select');
        const ret = await handleSelect(
        `select s.sno,
            s.sname,s.sdept,c.cno,c.cname,sc.grade,
            rank() over (partition by s.sdept order by sc.grade desc) as grade_rank
            from student s join sc on s.sno = sc.sno join course c on sc.cno = c.cno
            order by s.sdept, sc.grade desc;`
        );
        setResultTable(ret);
    }
    const handleSearch = async () => {
        setStatus('select');
        const sno = snoRef.current.value;
        const ret = await handleSelect(
        ` select
                s.sno,
                s.sname,
                c.cno,
                c.cname,
                sc.grade
                from
                student s
                join sc on s.sno = sc.sno
                join course c on sc.cno = c.cno
                where
                s.sno = ${sno}
                order by
                c.cno;`
        );
        setResultTable(ret);
    }
    const formTable = (
        <table className={"insertTable"}>
            <tbody>
            <tr>
                <td>Sno</td> <td>Cno</td> <td>Grade</td>
            </tr>
            <tr>
                <td><input type={"text"} name={"Sno"} ref={snoRef}/></td>
                <td><input type={"text"} name={"Cno"} ref={cnoRef}/></td>
                <td><input type={"number"} name={"Grade"}/></td>
            </tr>
            </tbody>
        </table>
    );
    return (
        <div className={"menu3"}>
            {status === 'add' &&
                <form onSubmit={handleInsert}>
                    {formTable}
                    <button type={'submit'} className={"menu2Btn submitBtn"}>提交</button>
                </form>
            }
            {status === 'modify' &&
                <form onSubmit={handleUpdate}>
                    {formTable}
                    <button type={'submit'} className={"menu3Btn submitBtn"}>修改</button>
                    <button type={'button'} className={"menu3Btn deleteBtn"} onClick={handleDelete} formNoValidate>删除</button>
                </form>
            }
            {status === 'search' &&
                <div>
                    <table className={"insertTable"}>
                        <tbody>
                        <tr>
                            <td>Sno</td>
                        </tr>
                        <tr>
                            <td><input type={"text"} name={"Sno"} ref={snoRef}/></td>
                        </tr>
                        </tbody>
                    </table>
                    <button className={"menu3Btn searchBtn"} onClick={handleSearch}>查找</button>
                </div>
            }
            <div className={"resultText text"}>
                {result}
            </div>
            <div className={"resultTable"}>
                {status === 'select' && resultTable}
            </div>
            <div className={"menu1Buttons"}>
                <button className={"menu1Btn"} onClick={handleBtn1}>查看成绩总览</button>
                <button className={"menu1Btn"} onClick={handleBtn2}>录入成绩信息</button>
                <button className={"menu1Btn"} onClick={handleBtn3}>修改成绩信息</button>
                <button className={"menu1Btn"} onClick={handleOverview}>查看概况</button>
                <button className={"menu1Btn"} onClick={handleRank}>查看排名</button>
                <button className={"menu1Btn"} onClick={() => setStatus('search')}>查看学生成绩</button>
            </div>
        </div>
    );
}

function Manage() {
    const [status, setStatus] = useState('initial');
    const [overHome, setOverHome] = useState(false);
    const handleMouseEnter = () => {
        setOverHome(true);
    };

    const handleMouseLeave = () => {
        setOverHome(false);
    };
    const handleFallbackHome = () => {
        setStatus('initial');
    }
    const navigator = (
        <nav className={"navigator"}>
            {/*1*/}
            <button className={"manageBtn"} id={"btn1"} onClick={()=>setStatus('handler1')}>修改学生信息</button>

            {/*2*/}
            <button className={"manageBtn"} id={"btn2"} onClick={()=>setStatus('handler2')}>维护课程信息</button>

            {/*3*/}
            <button className={"manageBtn"} id={"btn3"} onClick={()=>setStatus('handler3')}>管理学生成绩</button>
        </nav>
    );

    return (
        <div className={"manage"}>
            <header>
            </header>
            {status === 'initial' && navigator}
            {status === 'handler1' && <Menu1/>}
            {status === 'handler2' && <Menu2/>}
            {status === 'handler3' && <Menu3/>}
            <div className="manageText text">
                学生数据管理系统
            </div>
            <div className={"sideBar"}>
                <img src={home} className={"fallbackHome"} alt={"arrow"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleFallbackHome}/>
                <motion.div className={"animation circle"}
                            style={{}}
                            animate={overHome ? {x: -20} : {x: 0}}
                ></motion.div>
            </div>
        </div>
    );
}

export default Manage;
