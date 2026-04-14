import { Typography } from '@mui/material';
import { PanelSection } from './MuiWrappers.tsx';
import { Vec2Input } from './inputs/Vec2Input.tsx';
import { type CurveNode2, setCurveNodePosition2, setCurveNodeTangent2 } from '../geometry/curves2.ts';

interface NodeParamsSectionProps {
    node?: CurveNode2;
    setNode?: (node: CurveNode2) => void;
}

export function NodeParamsSection({ node, setNode }: NodeParamsSectionProps) {
    return (
        <PanelSection>
            <Typography variant='h6'>Selected Node</Typography>

            {node && setNode ? (
                <>
                    <Vec2Input
                        label='Node Position'
                        value={node.position}
                        setValue={v => setNode(setCurveNodePosition2(node, v))}
                    />

                    <Vec2Input
                        label='Tangent 1 End'
                        value={node.tangentEnd1}
                        setValue={v => setNode(setCurveNodeTangent2(node, 'tangentEnd1', v))}
                    />

                    <Vec2Input
                        label='Tangent 2 End'
                        value={node.tangentEnd2}
                        setValue={v => setNode(setCurveNodeTangent2(node, 'tangentEnd2', v))}
                    />
                </>
            ) : (
                <Typography variant='body2'>No node selected</Typography>
            )}
        </PanelSection>
    )
}