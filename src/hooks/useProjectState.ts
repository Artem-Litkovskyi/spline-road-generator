import { useState } from 'react';
import path from 'path-browserify';

import { type CurveNode3 } from '../geometry/curveNode.ts';
import { generateRoadProfile, generateSweepSurfaceMesh } from '../geometry/mesh.ts';
import { convertCoordinateSystem3 } from '../geometry/vec3.ts';

import { COORDINATE_SYSTEMS, exportToGLTF, exportToOBJ, exportToSVG, type ExtensionType } from '../utils/export.ts';
import { readProjectFile, writeProjectFile } from '../utils/projectFile.ts';

export type ProjectData = {
    closedPath: boolean;
    profileHeight: number;
    curveNodes: CurveNode3[];
    roadWidths: number[];
}

export const DEFAULT_PROJECT_DATA: ProjectData = {
    closedPath: true,
    profileHeight: 2,
    curveNodes: [
        {
            position: { x: -100, y: 0, z: 0 },
            tangentEnd1: { x: -170, y: 0, z: 0 },
            tangentEnd2: { x: -10, y: 0, z: 0 },
        },
        {
            position: { x: 200, y: 0, z: 0 },
            tangentEnd1: { x: 110, y: 0, z: 0 },
            tangentEnd2: { x: 250, y: 0, z: 0 },
        },
        {
            position: { x: 210, y: -60, z: 0 },
            tangentEnd1: { x: 250, y: -50, z: 0 },
            tangentEnd2: { x: 130, y: -80, z: 0 },
        },
        {
            position: { x: -90, y: -130, z: 0 },
            tangentEnd1: { x: -10, y: -110, z: 0 },
            tangentEnd2: { x: -210, y: -160, z: 0 },
        },
    ],
    roadWidths: [15,15,15,15]
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
        setSelectedNode(null);
        setDirty(false);
    };

    const openProject = async (file: File) => {
        const data = await readProjectFile(file);
        setProject(data);
        setFilename(path.basename(file.name, '.json'));
        setSelectedNode(null);
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
        samplingResolution: number,
        roadColor: string,
    ) => {
        switch (extension) {
            case 'svg':
                exportToSVG(project.curveNodes, project.roadWidths, project.closedPath, samplingResolution, roadColor, exportFilename);
                break;
            default:
                console.error(`Unsupported 2D export extension: ${extension}`);
                break;
        }
    }

    const exportProject3D = (
        exportFilename: string,
        extension: ExtensionType,
        samplingResolution: number,
    ) => {
        const { vertices, indices } = generateRoadMesh(samplingResolution);

        switch (extension) {
            case 'obj':
                exportToOBJ(vertices, indices, exportFilename);
                break;
            case 'gltf':
                exportToGLTF(vertices, indices, exportFilename, false);
                break;
            case 'glb':
                exportToGLTF(vertices, indices, exportFilename, true);
                break;
            default:
                console.error(`Unsupported 3D export extension: ${extension}`);
                break;
        }
    }

    const generateRoadMesh = (
        samplingResolution: number
    ) => {
        const { profile, skipPolygonIdx } = generateRoadProfile(1, project.profileHeight);
        const { vertices, indices } = generateSweepSurfaceMesh(
            project.curveNodes, project.roadWidths, profile, samplingResolution, project.closedPath, skipPolygonIdx);

        const from = COORDINATE_SYSTEMS.editor;
        const to = COORDINATE_SYSTEMS.file;

        const convertedVertices = vertices.map(v => convertCoordinateSystem3(
            v, from.right, from.forward, from.up, to.right, to.forward, to.up)
        ).flatMap(v => [v.x, v.y, v.z]);

        return { vertices: convertedVertices, indices };
    }

    // Edit
    const updateProject = <K extends keyof ProjectData>(
        key: K,
        value: ProjectData[K]
    ) => {
        setProject(p => ({ ...p, [key]: value }));
        setDirty(true);
    };

    const updateRoadWidth = (
        index: number,
        updater: (prev: number) => number
    ) => {
        setProject(prev => ({
            ...prev,
            roadWidths: prev.roadWidths.map((width, i) =>
                i === index ? updater(width) : width
            ),
        }));
        setDirty(true);
    };

    const setRoadWidth = (
        index: number,
        newWidth: number
    ) => {
        updateRoadWidth(index, _ => newWidth);
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
        const insertIndex = index ?? project.curveNodes.length;
        setProject(prev => ({
            ...prev,
            curveNodes: prev.curveNodes.toSpliced(
                insertIndex,
                0,
                node
            ),
            roadWidths: prev.roadWidths.toSpliced(
                insertIndex,
                0,
                prev.roadWidths[insertIndex - 1]
            ),
        }));
        setDirty(true);
    };

    const removeNode = (index: number) => {
        setProject(prev => ({
            ...prev,
            curveNodes: prev.curveNodes.toSpliced(index, 1),
            roadWidths: prev.roadWidths.toSpliced(index, 1),
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
        generateRoadMesh,

        updateProject,
        updateRoadWidth,
        setRoadWidth,
        updateNode,
        setNode,
        addNode,
        removeNode,
    };
}