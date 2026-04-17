import { Typography } from '@mui/material';
import { PanelSection } from './MuiWrappers.tsx';
import { Vec3Input } from './inputs/Vec3Input.tsx';
import { type CurveNode3, moveCurveNode3, moveCollinearTangent3 } from '../geometry/curveNode.ts';

interface NodeParamsSectionProps {
    node?: CurveNode3;
    setNode?: (node: CurveNode3) => void;
}

export function NodeParamsSection({ node, setNode }: NodeParamsSectionProps) {
    return (
        <PanelSection>
            <Typography variant='h6'>Selected Node</Typography>

            {node && setNode ? (
                <>
                    <Vec3Input
                        label='Node Position'
                        value={node.position}
                        setValue={v => setNode(moveCurveNode3(node, v))}
                    />

                    <Vec3Input
                        label='Tangent 1 End'
                        value={node.tangentEnd1}
                        setValue={v => setNode(moveCollinearTangent3(node, 'tangentEnd1', v))}
                    />

                    <Vec3Input
                        label='Tangent 2 End'
                        value={node.tangentEnd2}
                        setValue={v => setNode(moveCollinearTangent3(node, 'tangentEnd2', v))}
                    />
                </>
            ) : (
                <Typography variant='body2'>No node selected</Typography>
            )}
        </PanelSection>
    )
}