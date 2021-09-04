/**
 * Builds a query object using the current document object model (DOM).
 * Must use the browser's global document object {@link https://developer.mozilla.org/en-US/docs/Web/API/Document}
 * to read DOM information.
 *
 * @returns query object adhering to the query EBNF
 */

let arrMField = ["lat", "lon", "seats", "avg", "pass", "fail", "audit", "year"];

let getWhere = (conditions, db) => {
    let query = {};
    let allAnyNone = conditions.querySelector(".condition-type input[checked]").value;
    let allConditions = conditions.querySelectorAll(".condition");
    
    let condArray = []
    for(let cond of allConditions) {
        let neg = cond.querySelector(".not input").checked;
        let field = cond.querySelector(".fields option[selected]").value;
        let op = cond.querySelector(".operators option[selected]").value;
        let term = cond.querySelector(".term input").value;
        if(term.length){
            if (arrMField.includes(field)){
                term = Number(term);
            }
            let pushCond = {[op] : {[db + "_" + field] : term}}
            if(neg) pushCond = {"NOT": pushCond};
            condArray.push(pushCond);
        }
    }
    if(condArray.length === 1){
        (allAnyNone === "none") ? query["NOT"] = condArray[0] : query = condArray[0];
    } else if(condArray.length > 1){
        switch(allAnyNone){
            case "all": query["AND"] = condArray;
                break;
            case "any": query["OR"] = condArray;
                break;
            case "none": query["NOT"] = {"OR" : condArray};
                break;
        }
    }
    return query;
}
let getOptions = (columns, order, tform, db) => {
    let query = {};

    let orderObj = {};
    let allOptions = columns.querySelectorAll("input[checked]");
    let orderBy = order.querySelectorAll("option[selected]");
    let ascDesc = order.querySelector("input").checked;
    let allTransforms = Array.from(tform.querySelectorAll(".term input")).map((obj) => obj.value);

    if(allOptions.length) query["COLUMNS"] = Array.from(allOptions).map((opt) =>
        allTransforms.includes(opt.value) ? opt.value : db + "_" + opt.value);

    if (orderBy.length){
        orderObj["keys"] = Array.from(orderBy).map((obj) =>
            allTransforms.includes(obj.value) ? obj.value : db + "_" + obj.value);
        orderObj["dir"] = ascDesc ? "DOWN" : "UP";
        query["ORDER"] = orderObj;
    }
    return query;
}
let getTransformation = (groups, tform, db) => {
    let query = {};

    let allGroups = groups.querySelectorAll("input[checked='checked']");
    if(allGroups.length) query["GROUP"] = Array.from(allGroups).map((opt) => db + "_" + opt.value);

    let allTransforms = Array.from(tform.getElementsByClassName("control-group transformation"));

    let apply = []
    allTransforms.forEach((trans, i) => {
        let term = trans.querySelector(".term input").value;
        let op = trans.querySelector(".operators [selected=\"selected\"]").value;
        let fields = trans.querySelector(".fields [selected=\"selected\"]").value;
        if (term.length) {
            let addTransform = {[term] : { [op] : db + "_" + fields}};
            apply.push(addTransform);
        }
    })
    if (apply.length) query["APPLY"] = apply;
    return query;
}

CampusExplorer.buildQuery = () => {
    let query = {};
    let queryForm = document.querySelector(".active.tab-panel form");
    let database = queryForm.getAttribute("data-type");
    database = database.toString();

    let conditions = queryForm.querySelector(".conditions");
    let columns = queryForm.querySelector(".columns");
    let order = queryForm.querySelector(".order");
    let groups = queryForm.querySelector(".groups");
    let transf = queryForm.querySelector(".transformations");

    let where = getWhere(conditions, database);
    let options = getOptions(columns, order, transf, database);
    let transformations = getTransformation(groups, transf, database);

    query["WHERE"] = where;
    if(Object.keys(options).length) query["OPTIONS"] = options;
    if(Object.keys(transformations).length) query["TRANSFORMATIONS"] = transformations;
    return query;
};
