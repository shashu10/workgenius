class GoalControls implements ng.IDirective {

    static instance(): ng.IDirective {return new GoalControls()}

    template = ' \
        <p class="earnings-goal-text">{{currentUser.earningsGoal | currency : undefined : 0}}</p> \
        <p class="hours-goal-text">in {{currentUser.hoursGoal}} {{currentUser.hoursGoal === 1 ? "hr" : "hrs"}}</p> \
        <div class="item range range-positive"> \
            $0 <input type="range" ng-model="currentUser.earningsGoal" ng-change="onChange()" name="hours" min="0" max="280"> $280 \
        </div> \
    '
    restrict = 'E'
    scope = {
        currentUser: '=',
        onChange: '=',
    }
}
