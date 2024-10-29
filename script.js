// Проверка, что D3.js загружен
if (typeof d3 === 'undefined') {
    throw new Error('D3.js не загружен. Убедитесь, что библиотека D3.js подключена перед вашим скриптом.');
}

// Данные экосистемы профессий AI
const data = {
    name: "AI Jobs Ecosystem",
    children: [
        {
            name: "Data Analysis & Business Intelligence",
            children: [
                { name: "Data Analyst", description: "Analyze data for actionable insights." },
                { name: "BI Analyst", description: "Develop business intelligence strategies." },
                { name: "Business Analyst", description: "Identify business needs and solutions." },
                { name: "Marketing Analyst", description: "Analyze marketing data and trends." },
                { name: "Operations Analyst", description: "Improve operational efficiency through data." },
                { name: "Research Analyst", description: "Conduct research and analyze data." },
                { name: "Supply Chain Analyst", description: "Optimize supply chain performance." }
            ]
        },
        {
            name: "Data Science & Machine Learning",
            children: [
                { name: "Data Scientist", description: "Extract insights from complex data." },
                { name: "Machine Learning Engineer", description: "Develop machine learning algorithms." },
                { name: "ML Developer", description: "Create machine learning applications." },
                { name: "Deep Learning Engineer", description: "Develop deep learning models." },
                { name: "Predictive Modeler", description: "Build models to predict outcomes." },
                { name: "Statistician", description: "Analyze data using statistical methods." },
                { name: "Econometrician", description: "Apply economics and statistical methods." }
            ]
        },
        {
            name: "AI & Robotics",
            children: [
                { name: "AI Developer", description: "Create AI applications." },
                { name: "AI Research Scientist", description: "Research advanced AI technologies." },
                { name: "Robotics Engineer", description: "Build robotic systems." },
                { name: "Robotics Control Engineer", description: "Design robotic control systems." },
                { name: "Autonomous Systems Engineer", description: "Create autonomous system solutions." },
                { name: "Cognitive Machine Engineer", description: "Develop cognitive machine systems." },
                { name: "AI Software Developer", description: "Create AI software applications." }
            ]
        },
        {
            name: "Data Engineering & Management",
            children: [
                { name: "Data Engineer", description: "Design and build data systems." },
                { name: "Data Architect", description: "Architect large-scale data solutions." },
                { name: "Database Administrator", description: "Manage and maintain databases." },
                { name: "Data Governance Manager", description: "Oversee data governance policies." },
                { name: "Data Quality Manager", description: "Ensure data quality standards." },
                { name: "Data Privacy Officer", description: "Manage data privacy practices." },
                { name: "Data Operations Manager", description: "Oversee data operations processes." }
            ]
        },
        {
            name: "Research and Development",
            children: [
                { name: "AI Research Scientist", description: "Conduct AI research and development." },
                { name: "Computational Linguist", description: "Develop computational language models." },
                { name: "Quantum Machine Learning Researcher", description: "Research quantum ML methods." },
                { name: "Researcher Machine Intelligence", description: "Research machine intelligence technologies." },
                { name: "Natural Language Understanding Engineer", description: "Develop NLU systems." },
                { name: "AI Policy Researcher", description: "Research AI policy and ethics." },
                { name: "AI Research Intern", description: "Support AI research projects." }
            ]
        }
    ]
};

// Размеры узлов
const centralNodeSize = 50; // Увеличен радиус центрального круга до 50px
const categoryNodeSize = 25;
const jobNodeSize = 10;

// Цветовая схема для 5 категорий
const categoryColors = [
    "#1f77b4", // Data Analysis & Business Intelligence - синий
    "#ff7f0e", // Data Science & Machine Learning - оранжевый
    "#2ca02c", // AI & Robotics - зеленый
    "#d62728", // Data Engineering & Management - красный
    "#9467bd"  // Research and Development - фиолетовый
];
const jobNodeColor = "#ff9800"; // Оранжевый для профессий
const linkColor = "#888"; // Цвет связей

// Настройки SVG
const container = d3.select("#graph");
let width = container.node().clientWidth;
let height = container.node().clientHeight;

// Создание zoom поведения и сохранение его в переменную
const zoomBehavior = d3.zoom()
    .scaleExtent([0.5, 3]) // Ограничение масштаба
    .on("zoom", zoomed);

// Добавление SVG и вызов zoom
const svgElement = container.append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoomBehavior);

const svg = svgElement.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

// Определение градиентов
const defs = svg.append("defs");

categoryColors.forEach((color, index) => {
    defs.append("linearGradient")
        .attr("id", `categoryGradient${index + 1}`)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .selectAll("stop")
        .data([
            { offset: "0%", color: color },
            { offset: "100%", color: d3.color(color).brighter(0.5) }
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
});

// Создание иерархии данных
let root = d3.hierarchy(data);

// Начальная раскладка дерева
const treeLayout = d3.tree()
    .size([2 * Math.PI, Math.min(width, height) / 2]) // Радиус дерева
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

treeLayout(root);

// Создание связей (links)
const linkGroup = svg.append("g")
    .attr("class", "links");

linkGroup.selectAll("path")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y))
    .attr("stroke", linkColor)
    .attr("stroke-opacity", 0.6)
    .attr("stroke-dasharray", "5,5")
    .attr("fill", "none")
    .attr("marker-end", "url(#arrow)") // Добавление стрелок
    .on("mouseover", function() {
        d3.select(this).attr("stroke-width", 3).attr("stroke", "#2196F3");
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke-width", 2).attr("stroke", linkColor);
    });

// Определение стрелок для связей
defs.append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", linkColor);

// Создание узлов (nodes)
const nodeGroup = svg.append("g")
    .attr("class", "nodes");

// Функция для определения позиции и выравнивания текста
function positionLabel(angle) {
    if (angle > -90 && angle <= 90) {
        return {
            anchor: "start",
            offset: 15, // Отступ справа
            rotation: 0
        };
    } else {
        return {
            anchor: "end",
            offset: -15, // Отступ слева
            rotation: 0
        };
    }
}

// Функция для предотвращения наложения текстов (простейшая реализация)
function preventOverlap(labels) {
    // Сортировка по y позиции
    labels.sort((a, b) => a.y - b.y);
    for (let i = 1; i < labels.length; i++) {
        if (labels[i].y - labels[i - 1].y < 20) { // Минимальный отступ 20px
            labels[i].y = labels[i - 1].y + 20;
            labels[i].text.attr("transform", `translate(${labels[i].x},${labels[i].y})`);
        }
    }
}

// Создание узлов
const nodes = nodeGroup.selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", d => d.depth === 1 ? "node depth-1" : "node")
    .attr("transform", d => `
        rotate(${(d.x * 180 / Math.PI) - 90})
        translate(${d.y},0)
    `)
    .on("click", (event, d) => handleNodeClick(event, d))
    .on("mouseover", (event, d) => handleNodeMouseOver(event, d))
    .on("mouseout", handleNodeMouseOut)
    .attr("tabindex", 0) // Для доступности: фокусируемые элементы
    .attr("role", "button") // Для доступности: роль кнопки
    .attr("aria-label", d => d.depth === 2 ? d.data.name : d.data.name + " category");

// Добавление кругов к узлам
nodes.append("circle")
    .attr("r", d => {
        if (d.depth === 0) return centralNodeSize;
        if (d.depth === 1) return categoryNodeSize;
        return jobNodeSize;
    })
    .attr("fill", d => {
        if (d.depth === 0) return "#000"; // Центральный круг черный
        if (d.depth === 1) return `url(#categoryGradient${d.parent.children.indexOf(d) + 1})`;
        return jobNodeColor; // Профессии имеют один общий цвет
    })
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .on("mouseover", function() {
        d3.select(this).attr("stroke-width", 3).attr("stroke", "#ff9800");
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke-width", 2).attr("stroke", "#fff");
    });

// Добавление текста к узлам всех уровней
nodes.append("text")
    .attr("dy", "0.31em")
    .attr("x", function(d) {
        if (d.depth === 0 || d.depth === 1) {
            return 0;
        } else { // Для профессий
            let angle = (d.x * 180 / Math.PI) - 90;
            let pos = positionLabel(angle);
            return pos.offset;
        }
    })
    .attr("text-anchor", function(d) {
        if (d.depth === 0 || d.depth === 1) {
            return "middle";
        } else { // Для профессий
            let angle = (d.x * 180 / Math.PI) - 90;
            let pos = positionLabel(angle);
            return pos.anchor;
        }
    })
    .attr("transform", function(d) {
        if (d.depth === 0) {
            return "translate(0, 0)";
        } else if (d.depth === 1) {
            return "";
        } else { // Для профессий
            return "rotate(0)"; // Текст всегда горизонтальный
        }
    })
    .style("font-size", function(d) {
        return d.depth === 0 ? "16px" : d.depth === 1 ? "14px" : "12px";
    })
    .style("font-weight", function(d) {
        return d.depth === 0 ? "700" : d.depth === 1 ? "700" : "400";
    })
    .style("fill", function(d) {
        return d.depth === 1 ? "#fff" : "#333";
    })
    .each(function(d) {
        const text = d3.select(this);
        if (d.depth === 0) {
            // Текст внутри центрального круга
            text.text(d.data.name);
            // Добавление переноса строк, если текст слишком длинный
            const words = d.data.name.split(" ");
            if (words.length > 3) {
                text.text("");
                words.forEach((word, i) => {
                    text.append("tspan")
                        .attr("x", 0)
                        .attr("dy", i === 0 ? "-0.6em" : "1.2em")
                        .text(word);
                });
            }
        } else if (d.depth === 1) {
            // Категории: центрированный текст
            text.text(d.data.name);
        } else {
            // Профессии: горизонтальный текст с отступом
            text.text(d.data.name);
        }
    })
    .on("mouseover", function(event, d) {
        if (d.depth !== 0) {
            d3.select(this).style("fill", "#ff9800");
        }
    })
    .on("mouseout", function(event, d) {
        if (d.depth === 1) {
            d3.select(this).style("fill", "#fff");
        } else {
            d3.select(this).style("fill", "#333");
        }
    });

// Добавление лидирующих линий (leader lines) для профессий
nodes.filter(d => d.depth === 2).append("line")
    .attr("class", "leader-line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 12) // Отступ от узла
    .attr("y2", 0)
    .attr("stroke", "#ff9800")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "2,2");

// Функция масштабирования
function zoomed(event) {
    svg.attr("transform", `translate(${width / 2},${height / 2}) ${event.transform}`);
    
    // Масштабирование текста
    svg.selectAll("text")
        .attr("font-size", function(d) {
            let scale = event.transform.k;
            let baseSize = d.depth === 0 ? 16 : d.depth === 1 ? 14 : 12;
            return (baseSize / scale) + "px";
        });
}

// Функция обработки клика на узел
function handleNodeClick(event, d) {
    if (d.depth === 2) { // Только для профессий
        addToComparison(d);
        showModal(d);
    } else if (d.depth === 1) { // Для категорий
        handleCategoryClick(d);
    } else { // Для центрального узла
        toggleChildren(d);
    }
}

// Функция обработки наведения на узел
function handleNodeMouseOver(event, d) {
    showTooltip(event, d);
    if (d.depth === 2) { // Только для профессий
        highlightConnections(d);
    }
}

// Функция обработки ухода курсора с узла
function handleNodeMouseOut(event, d) {
    hideTooltip();
    resetConnectionHighlight();
}

// Функция показа всплывающей подсказки
function showTooltip(event, d) {
    if (d.depth === 0 || d.depth === 1) return; // Не показывать подсказку для центрального узла и категорий

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .html(`<strong>${d.data.name}</strong><br>${d.data.description || ''}`)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY + 15) + "px")
        .style("opacity", 1);
}

// Функция скрытия всплывающей подсказки
function hideTooltip() {
    d3.selectAll(".tooltip")
        .transition()
        .duration(200)
        .style("opacity", 0)
        .remove();
}

// Функция выделения связей при наведении
function highlightConnections(d) {
    linkGroup.selectAll("path")
        .style("stroke", link => (link.source === d || link.target === d) ? "#2196F3" : linkColor)
        .style("stroke-width", link => (link.source === d || link.target === d) ? 3 : 2)
        .style("opacity", link => (link.source === d || link.target === d) ? 0.8 : 0.6);
}

// Функция сброса выделения связей
function resetConnectionHighlight() {
    linkGroup.selectAll("path")
        .style("stroke", linkColor)
        .style("stroke-width", 2)
        .style("opacity", 0.6);
}

// Функция выделения связанных профессий при клике на категорию
function highlightRelatedJobs(categoryNode) {
    const relatedJobs = categoryNode.descendants().filter(d => d.depth === 2);
    
    svg.selectAll(".node")
        .style("opacity", d => {
            if (d.depth === 1) return categoryNode === d ? 1 : 0.2;
            if (d.depth === 2) return relatedJobs.includes(d) ? 1 : 0.2;
            return 1;
        });
    
    svg.selectAll(".link")
        .style("opacity", d => {
            const sourceMatch = relatedJobs.includes(d.source);
            const targetMatch = relatedJobs.includes(d.target);
            return sourceMatch || targetMatch ? 0.4 : 0.1;
        });
}

// Функция сброса подсветки
function resetHighlight() {
    svg.selectAll(".node").style("opacity", 1);
    svg.selectAll(".link").style("opacity", 0.6);
}

// Функция обработки кнопок управления масштабом и сброса
d3.select("#reset").on("click", () => {
    resetHighlight();
    // Сбросить трансформацию зума на исходную
    svgElement.transition()
        .duration(500)
        .call(zoomBehavior.transform, d3.zoomIdentity);
});

d3.select("#zoomIn").on("click", () => {
    svgElement.transition()
        .duration(500)
        .call(zoomBehavior.scaleBy, 1.2);
});

d3.select("#zoomOut").on("click", () => {
    svgElement.transition()
        .duration(500)
        .call(zoomBehavior.scaleBy, 0.8);
});

// Функция "Вписать в экран"
d3.select("#fitView").on("click", () => {
    const bounds = svg.node().getBBox();
    const fullWidth = width;
    const fullHeight = height;
    const widthScale = fullWidth / (bounds.width + 40); // Добавить отступы
    const heightScale = fullHeight / (bounds.height + 40);
    const scale = Math.min(widthScale, heightScale);

    svgElement.transition()
        .duration(750)
        .call(zoomBehavior.transform, d3.zoomIdentity
            .translate(fullWidth / 2, fullHeight / 2)
            .scale(scale)
            .translate(-bounds.x - bounds.width / 2, -bounds.y - bounds.height / 2));
});

// Функция обработки раскрытия и сворачивания узлов
function toggleChildren(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else if (d._children) {
        d.children = d._children;
        d._children = null;
    }
    update();
}

// Функция обновления графа после раскрытия/сворачивания узлов
function update() {
    treeLayout(root);

    // Обновление связей
    const updatedLinks = root.links();

    const linkSelection = linkGroup.selectAll("path")
        .data(updatedLinks, d => d.target.data.name);

    linkSelection.enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y))
        .attr("stroke", linkColor)
        .attr("stroke-opacity", 0.6)
        .attr("stroke-dasharray", "5,5")
        .attr("fill", "none")
        .attr("marker-end", "url(#arrow)")
        .on("mouseover", function() {
            d3.select(this).attr("stroke-width", 3).attr("stroke", "#2196F3");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke-width", 2).attr("stroke", linkColor);
        })
        .merge(linkSelection)
        .transition()
        .duration(500)
        .attr("d", d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y));

    linkSelection.exit().remove();

    // Обновление узлов
    const updatedNodes = root.descendants();

    const nodeSelection = nodeGroup.selectAll("g")
        .data(updatedNodes, d => d.data.name);

    const nodeEnter = nodeSelection.enter()
        .append("g")
        .attr("class", d => d.depth === 1 ? "node depth-1" : "node")
        .attr("transform", d => `
            rotate(${(d.x * 180 / Math.PI) - 90})
            translate(${d.y},0)
        `)
        .on("click", (event, d) => handleNodeClick(event, d))
        .on("mouseover", (event, d) => handleNodeMouseOver(event, d))
        .on("mouseout", handleNodeMouseOut)
        .attr("tabindex", 0)
        .attr("role", "button")
        .attr("aria-label", d => d.depth === 2 ? d.data.name : d.data.name + " category");

    nodeEnter.append("circle")
        .attr("r", d => {
            if (d.depth === 0) return centralNodeSize;
            if (d.depth === 1) return categoryNodeSize;
            return jobNodeSize;
        })
        .attr("fill", d => {
            if (d.depth === 0) return "#000"; // Центральный круг черный
            if (d.depth === 1) return `url(#categoryGradient${d.parent.children.indexOf(d) + 1})`;
            return jobNodeColor; // Профессии имеют один общий цвет
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", function() {
            d3.select(this).attr("stroke-width", 3).attr("stroke", "#ff9800");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke-width", 2).attr("stroke", "#fff");
        });

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", function(d) {
            if (d.depth === 0 || d.depth === 1) {
                return 0;
            } else { // Для профессий
                let angle = (d.x * 180 / Math.PI) - 90;
                let pos = positionLabel(angle);
                return pos.offset;
            }
        })
        .attr("text-anchor", function(d) {
            if (d.depth === 0 || d.depth === 1) {
                return "middle";
            } else { // Для профессий
                let angle = (d.x * 180 / Math.PI) - 90;
                let pos = positionLabel(angle);
                return pos.anchor;
            }
        })
        .attr("transform", function(d) {
            if (d.depth === 0) {
                return "translate(0, 0)";
            } else if (d.depth === 1) {
                return "";
            } else { // Для профессий
                return "rotate(0)"; // Текст всегда горизонтальный
            }
        })
        .style("font-size", function(d) {
            return d.depth === 0 ? "16px" : d.depth === 1 ? "14px" : "12px";
        })
        .style("font-weight", function(d) {
            return d.depth === 0 ? "700" : d.depth === 1 ? "700" : "400";
        })
        .style("fill", function(d) {
            return d.depth === 1 ? "#fff" : "#333";
        })
        .each(function(d) {
            const text = d3.select(this);
            if (d.depth === 0) {
                // Текст внутри центрального круга
                text.text(d.data.name);
                // Добавление переноса строк, если текст слишком длинный
                const words = d.data.name.split(" ");
                if (words.length > 3) {
                    text.text("");
                    words.forEach((word, i) => {
                        text.append("tspan")
                            .attr("x", 0)
                            .attr("dy", i === 0 ? "-0.6em" : "1.2em")
                            .text(word);
                    });
                }
            } else if (d.depth === 1) {
                // Категории: центрированный текст
                text.text(d.data.name);
            } else {
                // Профессии: горизонтальный текст с отступом
                text.text(d.data.name);
            }
        })
        .on("mouseover", function(event, d) {
            if (d.depth !== 0) {
                d3.select(this).style("fill", "#ff9800");
            }
        })
        .on("mouseout", function(event, d) {
            if (d.depth === 1) {
                d3.select(this).style("fill", "#fff");
            } else {
                d3.select(this).style("fill", "#333");
            }
        });

    // Добавление лидирующих линий (leader lines) для профессий
    nodeEnter.filter(d => d.depth === 2).append("line")
        .attr("class", "leader-line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 12) // Отступ от узла
        .attr("y2", 0)
        .attr("stroke", "#ff9800")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "2,2");

    // Обновление позиции узлов
    nodeSelection.merge(nodeEnter)
        .transition()
        .duration(500)
        .attr("transform", d => `
            rotate(${(d.x * 180 / Math.PI) - 90})
            translate(${d.y},0)
        `);

    nodeSelection.exit().remove();
}

// Функция показа модального окна
function showModal(d) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    
    modalTitle.textContent = d.data.name;
    modalDescription.textContent = d.data.description || "No description available.";
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
}

// Функция закрытия модального окна
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
}

// Обработчики для модального окна
const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close-button');

closeButton.onclick = () => closeModal();

window.onclick = (event) => {
    if (event.target === modal) {
        closeModal();
    }
};

// Функция добавления профессии в список сравнения
const comparisonList = document.getElementById('comparison-list');
let selectedJobs = [];

function addToComparison(d) {
    if (selectedJobs.includes(d)) return;
    if (selectedJobs.length >= 3) { // Ограничение до 3 профессий
        alert("You can compare up to 3 jobs.");
        return;
    }
    selectedJobs.push(d);
    updateComparisonList();
}

// Функция обновления списка сравнения
function updateComparisonList() {
    comparisonList.innerHTML = '';
    selectedJobs.forEach((job, index) => {
        const li = document.createElement('li');
        li.textContent = job.data.name;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";
        removeBtn.setAttribute('aria-label', `Remove ${job.data.name} from comparison`);
        removeBtn.onclick = () => {
            selectedJobs.splice(index, 1);
            updateComparisonList();
        };
        li.appendChild(removeBtn);
        comparisonList.appendChild(li);
    });
}

// Функция сравнения профессий (можно расширить)
function compareJobs() {
    if (selectedJobs.length < 2) {
        alert("Select at least two jobs to compare.");
        return;
    }
    // Пример: вывод имен профессий в консоль
    console.log("Comparing Jobs:");
    selectedJobs.forEach(job => {
        console.log(job.data.name, job.data.description);
    });
    // Здесь можно добавить более сложную логику сравнения
}

// Функция обработки фильтров
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const selectedCategories = Array.from(filterCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        svg.selectAll(".node")
            .style("display", d => {
                if (d.depth === 1 && !selectedCategories.includes(d.data.name)) {
                    return "none";
                }
                if (d.depth === 2 && !selectedCategories.includes(d.parent.data.name)) {
                    return "none";
                }
                return "block";
            });
        
        svg.selectAll(".link")
            .style("display", d => {
                if (d.source.depth === 1 && !selectedCategories.includes(d.source.data.name)) {
                    return "none";
                }
                if (d.target.depth === 1 && !selectedCategories.includes(d.target.data.name)) {
                    return "none";
                }
                return "block";
            });
    });
});

// Функционал поиска с автодополнением
const searchInput = document.getElementById('search');
const autocompleteList = document.getElementById('autocomplete-list');

// Соберите все названия профессий и категорий
const searchOptions = root.descendants().map(d => d.data.name);

// Функция для фильтрации и отображения предложений
function showAutocomplete(value) {
    autocompleteList.innerHTML = '';
    if (value.length < 2) return;

    const filtered = searchOptions.filter(option => option.toLowerCase().includes(value.toLowerCase()));
    filtered.slice(0, 10).forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.addEventListener('click', () => {
            searchInput.value = option;
            autocompleteList.innerHTML = '';
            performSearch(option.toLowerCase());
            focusOnNode(option);
        });
        autocompleteList.appendChild(li);
    });
}

searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    showAutocomplete(term);
    if (term.length < 2) {
        resetHighlight();
        return;
    }
    performSearch(term);
});

// Закрытие списка автодополнения при клике вне его
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        autocompleteList.innerHTML = '';
    }
});

// Функция поиска по карте
function performSearch(term) {
    svg.selectAll(".node")
        .style("opacity", d => {
            const match = d.data.name.toLowerCase().includes(term) ||
                (d.data.description && d.data.description.toLowerCase().includes(term));
            return match ? 1 : 0.2;
        });

    svg.selectAll(".link")
        .style("opacity", d => {
            const sourceMatch = d.source.data.name.toLowerCase().includes(term);
            const targetMatch = d.target.data.name.toLowerCase().includes(term);
            return sourceMatch || targetMatch ? 0.4 : 0.1;
        });

    // Подсветить найденные элементы
    svg.selectAll(".node")
        .filter(d => d.data.name.toLowerCase().includes(term) || 
                     (d.data.description && d.data.description.toLowerCase().includes(term)))
        .select("circle")
        .style("stroke", "#FF5722")
        .style("stroke-width", 3);
}

// Функция сброса подсветки
function resetHighlight() {
    svg.selectAll(".node").style("opacity", 1);
    svg.selectAll(".link").style("opacity", 0.6);
    svg.selectAll(".node circle")
        .style("stroke", d => d.depth === 0 ? "#000" : "#fff")
        .style("stroke-width", 2);
}

// Функция фокусировки на узле после выбора из автодополнения
function focusOnNode(name) {
    const node = root.descendants().find(d => d.data.name === name);
    if (node) {
        const transform = d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(1.5)
            .translate(-node.y * Math.cos(node.x - Math.PI / 2), -node.y * Math.sin(node.x - Math.PI / 2));
        svgElement.transition()
            .duration(750)
            .call(zoomBehavior.transform, transform);
    }
}

// Функция обработки клика на категорию для подсветки связанных профессий
function handleCategoryClick(d) {
    if (d.children) {
        highlightRelatedJobs(d);
    } else {
        resetHighlight();
    }
}

// Обработка клавиатурной навигации для узлов
nodes.on("keydown", (event, d) => {
    if (event.key === 'Enter' || event.key === ' ') {
        handleNodeClick(event, d);
        event.preventDefault();
    }
});

// Обработка клавиатурной навигации для кнопок
document.querySelectorAll('.zoom-button').forEach(button => {
    button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            button.click();
            event.preventDefault();
        }
    });
});

document.querySelectorAll('.reset-button').forEach(button => {
    button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            button.click();
            event.preventDefault();
        }
    });
});

// Функция обработки клика на узел
function handleNodeClick(event, d) {
    if (d.depth === 2) { // Только для профессий
        addToComparison(d);
        showModal(d);
    } else if (d.depth === 1) { // Для категорий
        handleCategoryClick(d);
    } else { // Для центрального узла
        toggleChildren(d);
    }
}

// Обработка события изменения размера окна
window.addEventListener('resize', () => {
    width = container.node().clientWidth;
    height = container.node().clientHeight;

    d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    svg.attr("transform", `translate(${width / 2},${height / 2})`);

    // Пересчет размеров дерева
    treeLayout.size([2 * Math.PI, Math.min(width, height) / 2]);
    treeLayout(root);
    update();
});

// Добавление индикатора загрузки
const loadingIndicator = d3.select("body")
    .append("div")
    .attr("class", "loading-indicator")
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("padding", "20px")
    .style("border-radius", "8px")
    .style("display", "none")
    .text("Loading...");

// Показать индикатор загрузки
function showLoading() {
    loadingIndicator.style("display", "block");
}

// Скрыть индикатор загрузки
function hideLoading() {
    loadingIndicator.style("display", "none");
}

// Показать всплывающие подсказки при наведении на узлы
nodes.on("mouseover", (event, d) => {
    handleNodeMouseOver(event, d);
});

nodes.on("mouseout", handleNodeMouseOut);

// Реализовать подсветку связанных элементов при наведении
function highlightRelatedElements(d) {
    svg.selectAll(".node")
        .filter(node => node === d || node.parent === d || d.parent === node)
        .select("circle")
        .attr("stroke", "#FF5722")
        .attr("stroke-width", 3);
}

function resetRelatedElements() {
    svg.selectAll(".node circle")
        .attr("stroke", d => d.depth === 0 ? "#000" : "#fff")
        .attr("stroke-width", 2);
}

// Добавить анимацию при фильтрации
function animateFilter() {
    svg.selectAll(".node")
        .transition()
        .duration(500)
        .style("opacity", 1)
        .style("transform", "scale(1)");

    svg.selectAll(".link")
        .transition()
        .duration(500)
        .style("opacity", 0.6);
}

// Добавить анимацию появления/скрытия элементов
function animateNodes() {
    svg.selectAll(".node")
        .transition()
        .duration(500)
        .attr("opacity", 1)
        .attr("transform", d => `
            rotate(${(d.x * 180 / Math.PI) - 90})
            translate(${d.y},0)
        `);
}

// Добавить индикатор загрузки при обновлении
function showLoadingIndicator() {
    showLoading();
    setTimeout(hideLoading, 1000); // Скрыть через 1 секунду
}

// Добавить проверку коллизий текста (базовая реализация)
function checkTextCollisions() {
    const labels = [];
    svg.selectAll("text").each(function(d) {
        if (d.depth === 2) { // Только для профессий
            const bbox = this.getBBox();
            labels.push({ x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height, textElement: d3.select(this) });
        }
    });
    preventOverlap(labels);
}

// Реализовать алгоритм распределения надписей
function distributeLabels() {
    checkTextCollisions();
}

// Оптимизировать пересчет позиций с использованием кэширования
let positionCache = {};

function getPosition(d) {
    const key = d.data.name;
    if (positionCache[key]) {
        return positionCache[key];
    }
    const angle = d.x;
    const radius = d.y;
    const x = radius * Math.cos(angle - Math.PI / 2);
    const y = radius * Math.sin(angle - Math.PI / 2);
    positionCache[key] = { x, y };
    return positionCache[key];
}

// Использовать RequestAnimationFrame для анимаций
function animateWithRAF(callback) {
    requestAnimationFrame(callback);
}

// Применять CSS трансформации вместо SVG где возможно
svg.selectAll("g")
    .style("transform", d => `rotate(${(d.x * 180 / Math.PI) - 90}deg) translate(${d.y}px,0)`);

// Инициализация
showLoadingIndicator();
update();
distributeLabels();

// Реализовать алгоритм распределения надписей после обновления
svg.selectAll("text").on("end", distributeLabels);
