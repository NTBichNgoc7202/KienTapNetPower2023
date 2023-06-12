import {
  trigger,
  transition,
  style,
  query as q,
  group,
  animateChild,
  animate,
  keyframes,
  AnimationMetadata,
  AnimationQueryOptions,
} from '@angular/animations';

const query = (
  s: string,
  a: AnimationMetadata[] | AnimationMetadata,
  o: AnimationQueryOptions = { optional: true }
) => q(s, a, o);

export const fader = trigger('routeAnimations', [
  transition('* <=> *', [
    // Set a default  style for enter and leave
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(0) translateY(100%)',
      }),
    ]),
    // Animate the new page in
    query(':enter', [
      animate(
        '600ms ease',
        style({ opacity: 1, transform: 'scale(1) translateY(0)' })
      ),
    ]),
  ]),
]);

export const slider = (device: string) =>
  trigger('routeAnimations', [
    transition('* => isLeft', slideTo('left', device)),
    transition('* => isRight', slideTo('right', device)),
    transition('isRight => *', slideTo('left', device)),
    transition('isLeft => *', slideTo('right', device)),
  ]);

function slideTo(direction: string, device: string = 'lg') {
  const optional = { optional: true };
  let top = '40%';
  switch (device) {
    case 'xs':
      top = '20%';
      break;
    case 'sm':
      top = '20%';
      break;
    case 'md':
      top = '40%';
      break;
    case 'lg':
      top = '40%';
      break;
    default:
      top = '40%';
      break;
  }
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: top,
          [direction]: 0,
          width: '100%',
        }),
      ],
      optional
    ),
    query(':enter', [style({ [direction]: '-100%' })]),
    group([
      query(
        ':leave',
        [animate('600ms ease', style({ [direction]: '100%' }))],
        optional
      ),
      query(':enter', [animate('600ms ease', style({ [direction]: '0%' }))]),
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    // query(':leave', animateChild()),
    // query(':enter', animateChild()),
  ];
}

export const getSliderAnimation = () => {
  // const isMobile = window.innerWidth <= 768;
  // const isMobile = matchMedia('(max-width: 768px)').matches;
  let screenSize: number = window.innerWidth;
  let device = 'lg';
  if (screenSize <= 1200) {
    device = 'md';
  }
  if (screenSize <= 992) {
    device = 'sm';
  }
  if (screenSize <= 768) {
    device = 'xs';
  }
  return slider(device);
};

export const routerTransition = trigger('routerTransition', [
  transition('* => *', [
    query(
      ':enter, :leave',
      style({ position: 'fixed', width: '100%', height: '100%' })
    ),
    query(':enter', style({ transform: 'translateX(100%)' })),

    group([
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('1.0s ease-in-out', style({ transform: 'translateX(-100%)' })),
      ]),
      query(':enter', [
        animate('1.0s ease-in-out', style({ transform: 'translateX(0%)' })),
        animateChild(),
      ]),
    ]),
  ]),
]);

export const pageAnimation = trigger('pageAnimation', [
  transition(':enter', [
    query('h1', [style({ transform: 'scale(0)' }), animate('1s', style('*'))], {
      optional: true,
    }),
  ]),
]);

export const transformer =
  trigger('routeAnimations', [
    transition('* => isLeft', transformTo({ x: -100, y: -100, rotate: -720 }) ),
    transition('* => isRight', transformTo({ x: 100, y: -100, rotate: 90 }) ),
    transition('isRight => *', transformTo({ x: -100, y: -100, rotate: 360 }) ),
    transition('isLeft => *', transformTo({ x: 100, y: -100, rotate: -360 }) )
]);


function transformTo({x = 100, y = 0, rotate = 0}) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`})
    ]),
    group([
      query(':leave', [
        animate('600ms ease-out', style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`}))
      ], optional),
      query(':enter', [
        animate('600ms ease-out', style({ transform: `translate(0, 0) rotate(0)`}))
      ])
    ]),
  ];
}

export const stepper =
  trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
        }),
      ]),
      group([
        query(':enter', [
          animate('2000ms ease', keyframes([
            style({ transform: 'scale(0) translateX(100%)', offset: 0 }),
            style({ transform: 'scale(0.5) translateX(25%)', offset: 0.3 }),
            style({ transform: 'scale(1) translateX(0%)', offset: 1 }),
          ])),
        ]),
        query(':leave', [
          animate('2000ms ease', keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(0.5) translateX(-25%) rotate(0)', offset: 0.35 }),
            style({ opacity: 0, transform: 'translateX(-50%) rotate(-180deg) scale(6)', offset: 1 }),
          ])),
        ])
      ]),
    ])

]);
