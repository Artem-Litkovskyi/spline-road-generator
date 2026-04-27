import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

import { type CurveNode3, getCurveBoundingBox3 } from '../geometry/curveNode.ts';

import { saveArrayBuffer, saveString } from './downloads.ts';
import { curveToPathCommands, curveWorldToSvg } from './svg.ts';

export type ExtensionType = 'obj' | 'gltf' | 'glb' | 'svg';

export const COORDINATE_SYSTEMS = {
    editor: {
        right: { x: 1, y: 0, z: 0 },
        forward: { x: 0, y: 1, z: 0 },
        up: { x: 0, y: 0, z: 1 }
    },
    file: {
        right: { x: 1, y: 0, z: 0 },
        forward: { x: 0, y: 0, z: -1 },
        up: { x: 0, y: 1, z: 0 }
    }
}

export function createScene(vertices: number[], indices: number[]) {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
    );

    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshMatcapMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    const scene = new THREE.Scene();

    scene.add(mesh);

    return scene;
}

export function exportToOBJ(vertices: number[], indices: number[], filename: string) {
    const exporter = new OBJExporter();
    const scene = createScene(vertices, indices);
    const result = exporter.parse(scene);
    saveString(result, `${filename}.obj`);
}

export function exportToGLTF(vertices: number[], indices: number[], filename: string, binary: boolean = true) {
    const exporter = new GLTFExporter();
    const scene = createScene(vertices, indices);

    exporter.parse(
        scene,
        function (result) {
            if (result instanceof ArrayBuffer) {
                saveArrayBuffer(result, `${filename}.glb`);
            } else {
                const output = JSON.stringify(result, null, 2);
                saveString(output, `${filename}.gltf`);
            }
        },
        function (error) { console.log('An error occurred during parse:', error); },
        { binary }
    );
}

export function exportToSVG(curveNodes: CurveNode3[], closedPath: boolean, roadWidth: number, color: string, filename: string) {
    const { min, max } = getCurveBoundingBox3(curveNodes);

    const minX = min.x - roadWidth;
    const minY = min.y - roadWidth;
    const maxX = max.x + roadWidth;
    const maxY = max.y + roadWidth;

    const canvasWidth = maxX - minX;
    const canvasHeight = maxY - minY;

    const panZoom = {
        panX: -minX,
        panY: minY,
        zoom: 1
    }

    const curveNodes2 = curveWorldToSvg(curveNodes, canvasHeight, panZoom);

    const d = curveToPathCommands(curveNodes2, closedPath);

    const result = `
        <svg xmlns='http://www.w3.org/2000/svg'
             width='${canvasWidth}'
             height='${canvasHeight}'
             viewBox='0 0 ${canvasWidth} ${canvasHeight}'>
          <path d='${d}'
                fill='none'
                stroke='${color}'
                stroke-width='${roadWidth}'/>
        </svg>
    `.trim();

    saveString(result, `${filename}.svg`);
}