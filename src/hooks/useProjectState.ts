import { useState } from 'react';
import path from 'path-browserify';

import { type CurveNode3 } from '../geometry/curveNode.ts';
import { generateRoadCrossSection, generateSweptSurfaceMesh } from '../geometry/mesh.ts';
import { convertCoordinateSystem3 } from '../geometry/vec3.ts';

import { COORDINATE_SYSTEMS, exportToGLTF, exportToOBJ, exportToSVG, type ExtensionType } from '../utils/export.ts';
import { readProjectFile, writeProjectFile } from '../utils/projectFile.ts';

export type ProjectData = {
    closedPath: boolean;
    roadWidth: number;
    sideHeight: number;
    curveNodes: CurveNode3[];
}

export const DEFAULT_PROJECT_DATA: ProjectData = {
    closedPath: true,
    roadWidth: 12,
    sideHeight: 2,
    curveNodes: [
        {
            position: { x: 100, y: 200, z: 0 },
            tangentEnd1: { x: 50, y: 300, z: 0 },
            tangentEnd2: { x: 150, y: 100, z: 0 },
        },
        {
            position: { x: 300, y: 200, z: 0 },
            tangentEnd1: { x: 400, y: 100, z: 0 },
            tangentEnd2: { x: 200, y: 300, z: 0 },
        },
        {
            position: { x: 500, y: 200, z: 0 },
            tangentEnd1: { x: 450, y: 300, z: 0 },
            tangentEnd2: { x: 550, y: 100, z: 0 },
        },
    ]
}

export function useProjectState() {
    const [filename, setFilename] = useState('untitled');
    const [dirty, setDirty] = useState<boolean>(false);
    const [project, setProject] = useState<ProjectData>(DEFAULT_PROJECT_DATA);
    const [selectedNode, setSelectedNode] = useState<number | null>();

    // New/Open/Save
    const newProject = () => {
        setProject(DEFAULT_PROJECT_DATA);
        setFilename('untitled');
        setDirty(false);
    };

    const openProject = async (file: File) => {
        const data = await readProjectFile(file);
        setProject(data);
        setFilename(path.basename(file.name, '.json'));
        setDirty(false);
    };

    const saveProject = (newFilename: string) => {
        setFilename(newFilename);
        writeProjectFile(project, newFilename);
        setDirty(false);
    };

    // Export
    const exportProject2D = (
        exportFilename: string,
        extension: ExtensionType,
        roadColor: string,
    ) => {
        switch (extension) {
            case 'svg':
                exportToSVG(project.curveNodes, project.closedPath, project.roadWidth, roadColor, exportFilename);
                break;
            default:
                console.error(`Unsupported 2D export extension: ${extension}`);
                break;
        }
    }

    const exportProject3D = (
        exportFilename: string,
        extension: ExtensionType,
        resolution: number,
    ) => {
        const { crossSection, skipPoligonIdx } = generateRoadCrossSection(project.roadWidth, project.sideHeight);
        const { vertices, indices } = generateSweptSurfaceMesh(
            project.curveNodes, crossSection, resolution, project.closedPath, skipPoligonIdx);

        const from = COORDINATE_SYSTEMS.editor;
        const to = COORDINATE_SYSTEMS.file;

        const convertedVertices = vertices.map(v => convertCoordinateSystem3(
            v, from.right, from.forward, from.up, to.right, to.forward, to.up)
        ).flatMap(v => [v.x, v.y, v.z]);

        switch (extension) {
            case 'obj':
                exportToOBJ(convertedVertices, indices, exportFilename);
                break;
            case 'gltf':
                exportToGLTF(convertedVertices, indices, exportFilename, false);
                break;
            case 'glb':
                exportToGLTF(convertedVertices, indices, exportFilename, true);
                break;
            default:
                console.error(`Unsupported 3D export extension: ${extension}`);
                break;
        }
    }

    // Edit
    const updateProject = <K extends keyof ProjectData>(
        key: K,
        value: ProjectData[K]
    ) => {
        setProject(p => ({ ...p, [key]: value }));
        setDirty(true);
    };

    const updateNode = (
        index: number,
        updater: (prev: CurveNode3) => CurveNode3
    ) => {
        setProject(prev => ({
            ...prev,
            curveNodes: prev.curveNodes.map((node, i) =>
                i === index ? updater(node) : node
            ),
        }));
        setDirty(true);
    };

    const setNode = (
        index: number,
        newNode: CurveNode3
    ) => {
        updateNode(index, _ => newNode);
    };

    const addNode = (node: CurveNode3, index?: number) => {
        setProject(prev => ({
            ...prev,
            curveNodes: prev.curveNodes.toSpliced(
                index ?? prev.curveNodes.length,
                0,
                node
            ),
        }));
        setDirty(true);
    };

    const removeNode = (index: number) => {
        setProject(prev => ({
            ...prev,
            curveNodes: prev.curveNodes.toSpliced(index, 1),
        }));
        setDirty(true);
    };

    return {
        filename,
        dirty,
        project,
        selectedNode,
        setFilename,
        setDirty,
        setProject,
        setSelectedNode,
        newProject,
        openProject,
        saveProject,
        exportProject2D,
        exportProject3D,
        updateProject,
        updateNode,
        setNode,
        addNode,
        removeNode,
    };
}