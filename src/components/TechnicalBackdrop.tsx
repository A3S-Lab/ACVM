export type TechnicalBackdropVariant =
  | 'flow'
  | 'state'
  | 'identity'
  | 'fog'
  | 'proof'
  | 'chains'
  | 'network';

export function TechnicalBackdrop({ variant }: { variant: TechnicalBackdropVariant }) {
  return (
    <div className={`technical-backdrop technical-backdrop--${variant}`} aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
        <g className="backdrop-frame">
          <path d="M32 112H228M1212 112H1408M32 806H198M1242 806H1408" />
          <path d="M32 112v28M1408 112v28M32 778v28M1408 778v28" />
          <circle cx="248" cy="112" r="2.5" />
          <circle cx="1192" cy="112" r="2.5" />
          <circle cx="218" cy="806" r="2.5" />
          <circle cx="1222" cy="806" r="2.5" />
        </g>

        {variant === 'flow' ? (
          <g className="backdrop-illustration">
            <text x="832" y="92">STATE TRANSITION TRACE</text>
            <path className="backdrop-dash" d="M820 130H918L952 104H1048L1082 130H1180L1214 104H1312" />
            <rect x="904" y="116" width="28" height="28" rx="3" />
            <rect x="1034" y="90" width="28" height="28" rx="3" />
            <rect x="1166" y="116" width="28" height="28" rx="3" />
            <rect x="1298" y="90" width="28" height="28" rx="3" />
            <circle className="backdrop-pulse" cx="820" cy="130" r="6" />
            <circle cx="952" cy="104" r="4" />
            <circle cx="1082" cy="130" r="4" />
            <circle cx="1214" cy="104" r="4" />
            <path d="M72 788H178L206 760H310L338 788H444" />
            <path className="backdrop-soft" d="M72 804H246M270 804H444" />
            <text x="72" y="744">DEPLOY / CALL / EXECUTE / VERIFY / FINALIZE</text>
          </g>
        ) : null}

        {variant === 'state' ? (
          <g className="backdrop-illustration">
            <text x="930" y="88">COMMITMENT TREE / STATE ROOT</text>
            <g className="backdrop-state-leaves">
              <rect x="884" y="104" width="38" height="30" rx="3" />
              <rect x="950" y="104" width="38" height="30" rx="3" />
              <rect x="1016" y="104" width="38" height="30" rx="3" />
              <rect x="1082" y="104" width="38" height="30" rx="3" />
              <rect x="1148" y="104" width="38" height="30" rx="3" />
            </g>
            <path d="M903 134 952 166M969 134 952 166M1035 134 1068 166M1101 134 1068 166M1167 134 1134 166" />
            <path d="M952 166 1043 196M1068 166 1043 196M1134 166 1043 196" />
            <circle className="backdrop-pulse" cx="1043" cy="196" r="12" />
            <path className="backdrop-dash" d="M1055 196H1298" />
            <text x="1216" y="187">ROOT(Σ)</text>
            <path d="M66 754h42v42H66zM126 734h42v62h-42zM186 714h42v82h-42zM246 694h42v102h-42z" />
            <path className="backdrop-soft" d="M54 812H310M54 680H310" />
            <text x="54" y="666">A / C / T / R / P</text>
          </g>
        ) : null}

        {variant === 'identity' ? (
          <g className="backdrop-illustration">
            <text x="1020" y="88">IDENTITY / ROLE / CAPABILITY</text>
            <path className="backdrop-orbit" d="M1128 104c72 0 130 35 130 78s-58 78-130 78-130-35-130-78 58-78 130-78Z" />
            <path className="backdrop-orbit backdrop-dash" d="M1058 116c62-36 129-35 150 2s-12 96-74 132-129 35-150-2 12-96 74-132Z" />
            <path d="m1128 144 34 20v40l-34 20-34-20v-40Z" />
            <circle className="backdrop-pulse" cx="1128" cy="184" r="8" />
            <circle cx="998" cy="182" r="6" />
            <circle cx="1258" cy="182" r="6" />
            <circle cx="1074" cy="116" r="6" />
            <circle cx="1182" cy="250" r="6" />
            <rect x="66" y="714" width="122" height="74" rx="8" />
            <circle cx="92" cy="741" r="10" />
            <path d="M82 768h80M110 736h52M210 730h162M210 754h124M210 778h184" />
            <text x="66" y="698">VERIFIABLE CREDENTIAL</text>
          </g>
        ) : null}

        {variant === 'fog' ? (
          <g className="backdrop-illustration">
            <text x="898" y="88">FOG PRIVACY DOMAIN</text>
            <rect className="backdrop-dash" x="990" y="102" width="276" height="136" rx="28" />
            <path d="M830 170H930L992 138M930 170l62 68M1266 138l92 32-92 68" />
            <rect x="806" y="146" width="48" height="48" rx="8" />
            <rect x="1030" y="128" width="54" height="54" rx="8" />
            <rect x="1168" y="158" width="54" height="54" rx="8" />
            <rect x="1340" y="146" width="48" height="48" rx="8" />
            <path className="backdrop-soft" d="m1057 155 138 30m-138-30 138 30m-138 0 138-30" />
            <circle className="backdrop-pulse" cx="930" cy="170" r="6" />
            <circle cx="992" cy="138" r="4" />
            <circle cx="992" cy="238" r="4" />
            <path className="backdrop-dash" d="M70 768c58-48 116-48 174 0s116 48 174 0" />
            <path d="M70 790h348" />
            <circle cx="70" cy="768" r="5" />
            <circle cx="244" cy="768" r="5" />
            <circle cx="418" cy="768" r="5" />
            <text x="70" y="740">LOCAL DATA / SEALED INPUT / RECEIPT</text>
          </g>
        ) : null}

        {variant === 'proof' ? (
          <g className="backdrop-illustration">
            <text x="976" y="88">RECURSIVE PROOF FOLDING</text>
            <rect x="1032" y="108" width="216" height="132" rx="12" />
            <rect x="1060" y="126" width="160" height="96" rx="10" />
            <rect x="1088" y="144" width="104" height="60" rx="8" />
            <circle className="backdrop-pulse" cx="1140" cy="174" r="9" />
            <path className="backdrop-dash" d="M906 174h126M1248 174h112" />
            <path d="m892 162 14 12-14 12M1360 162l14 12-14 12" />
            <path d="M64 774h64l22-22 22 22h64l22-22 22 22h64l22-22 22 22h64" />
            <circle cx="64" cy="774" r="5" />
            <circle cx="172" cy="774" r="5" />
            <circle cx="280" cy="774" r="5" />
            <circle cx="388" cy="774" r="5" />
            <circle cx="496" cy="774" r="5" />
            <text x="64" y="732">C₀ → C₁ → C₂ → … → Cₙ</text>
          </g>
        ) : null}

        {variant === 'chains' ? (
          <g className="backdrop-illustration">
            <text x="1012" y="88">CHAIN ADAPTER LAYER</text>
            <path className="backdrop-orbit" d="M1030 166c0-34 28-62 62-62h56c34 0 62 28 62 62s-28 62-62 62h-56c-34 0-62-28-62-62Z" />
            <path className="backdrop-orbit" d="M1154 166c0-34 28-62 62-62h56c34 0 62 28 62 62s-28 62-62 62h-56c-34 0-62-28-62-62Z" />
            <path className="backdrop-dash" d="M890 166h140M1334 166h62" />
            <circle className="backdrop-pulse" cx="890" cy="166" r="7" />
            <circle cx="1396" cy="166" r="7" />
            <path d="M72 748h92l26 26 26-26h92l26 26 26-26h92" />
            <rect x="58" y="730" width="28" height="36" rx="4" />
            <rect x="438" y="730" width="28" height="36" rx="4" />
            <text x="58" y="712">IDENTITY / EVENT / STATE / PROOF</text>
          </g>
        ) : null}

        {variant === 'network' ? (
          <g className="backdrop-illustration">
            <text x="1006" y="88">DEPLOYED CONTRACT NETWORK</text>
            <ellipse className="backdrop-orbit" cx="1148" cy="176" rx="176" ry="84" />
            <ellipse className="backdrop-orbit backdrop-dash" cx="1148" cy="176" rx="108" ry="128" transform="rotate(58 1148 176)" />
            <path d="M1148 176 990 146M1148 176l104-66M1148 176l148 54M1148 176l-76 92" />
            <circle className="backdrop-pulse" cx="1148" cy="176" r="12" />
            <circle cx="990" cy="146" r="7" />
            <circle cx="1252" cy="110" r="7" />
            <circle cx="1296" cy="230" r="7" />
            <circle cx="1072" cy="268" r="7" />
            <circle cx="72" cy="760" r="8" />
            <circle cx="180" cy="728" r="6" />
            <circle cx="288" cy="784" r="6" />
            <circle cx="396" cy="742" r="6" />
            <path className="backdrop-dash" d="M72 760 180 728l108 56 108-42" />
            <text x="72" y="704">INSTITUTION / ENTERPRISE / INDIVIDUAL</text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}
