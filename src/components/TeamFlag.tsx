import { getTeamFlagCode, teamFlagSrc } from '../lib/teamFlag'

type Props = {
  teamName: string
  flagSize?: number
  className?: string
}

export const TeamFlag = ({ teamName, flagSize = 20, className }: Props) => {
  const code = getTeamFlagCode(teamName)

  return (
    <span className={className ? `team-line ${className}` : 'team-line'}>
      {code ? (
        <img
          className="team-flag"
          src={teamFlagSrc(code)}
          alt=""
          width={flagSize}
          height={flagSize}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span
          className="team-flag-placeholder"
          style={{ width: flagSize, height: flagSize }}
          aria-hidden
        />
      )}
      <span className="team-line__name">{teamName}</span>
    </span>
  )
}
