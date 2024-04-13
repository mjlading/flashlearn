import { subjectStyles } from "@/lib/subject";
import * as d3 from "d3-force";
import React, { useEffect, useRef, useState } from "react";

interface Node extends d3.SimulationNodeDatum {
  text: string;
  weight: number;
}

export default function SubjectWordCloud({
  subjects,
}: {
  subjects: string[] | undefined;
}) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!subjects || subjects.length === 0) return;
    startSimulation();
  }, [subjects]);

  function startSimulation() {
    if (!subjects || subjects.length === 0) return;

    // Calculate the weights of each subject
    // Rehearsals must exist here (safely using !)
    const frequencies: { [key in string]: number } = {};
    for (const subject of subjects) {
      if (!frequencies[subject]) {
        frequencies[subject] = 1;
      } else {
        frequencies[subject] = frequencies[subject] + 1;
      }
    }

    const words: Node[] = [];

    for (const [subject, frequency] of Object.entries(frequencies)) {
      words.push({
        text: subject,
        weight: frequency,
      });
    }

    const simulation = d3
      .forceSimulation(words)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(300 / 2, 300 / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.weight * 10 + 20)
      )
      .on("tick", () => {
        setNodes(simulation.nodes());
      });

    // Clean up simulation on component unmount
    return () => simulation.stop();
  }

  return (
    <section className="col-span-2 p-4 bg-green-100 rounded-2xl">
      <h2 className="font-semibold text-xl leading-loose">Mine fagområder</h2>
      <svg ref={svgRef} height="300" width="300" className="mx-auto">
        {nodes.map((node, index) => (
          <g key={index} transform={`translate(${node.x}, ${node.y})`}>
            <circle
              r={node.weight * 10 + 10}
              className={subjectStyles[node.text].fillColor}
            />
            {React.createElement(subjectStyles[node.text].icon, {
              style: {
                transform: "translate(-3.8%, -3.8%)",
              },
            })}
          </g>
        ))}
      </svg>
    </section>
  );
}
