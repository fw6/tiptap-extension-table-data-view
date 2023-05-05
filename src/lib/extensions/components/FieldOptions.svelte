<script lang="ts">
    import type { FieldConfig } from "../types"

    export let visible = false;
    export let fieldConfig: FieldConfig

    let activeOptionIndex = -1;
    let fieldType = fieldConfig.type;
    let fieldName = fieldConfig.fieldName;

    $: {
        if (!visible) activeOptionIndex = -1;
    }
    $: {
        fieldType = fieldConfig.type;
        fieldName = fieldConfig.fieldName
    }

    const options = [
        {
            index: 0,
            icon: '😶‍🌫️',
            text: '修改字段列',
        },
        {
            index: 1,
            icon: '😵‍💫',
            text: '编辑字段列描述',
        },
        {
            index: 2,
            icon: '😢',
            text: '复制字段/列',
        },
        {
            index: 3,
            icon: '🤣',
            text: '向右插入字段/列',
        },
        {
            index: 4,
            icon: '🤣',
            text: '冻结至此字段/列',
        },
    ];
</script>

{#if visible}
    <div class="field-options">
        {#if activeOptionIndex < 0}
            {#each options as opt(opt.index)}
                <div class="option" on:mousedown={() => activeOptionIndex = opt.index}>{opt.icon}{opt.text}</div>
            {/each}
        {:else}
            <div class="option-settings">
                {activeOptionIndex}
                {#if activeOptionIndex === 0}
                    <label>
                        <span>标题</span>
                        <input type="text" bind:value={fieldName} >
                    </label>

                    <label>
                        <span>字段类型</span>
                        <select bind:value={fieldType}>
                            <option value="1">多行文本</option>
                            <option value="2">数字</option>
                            <option value="3">单选</option>
                            <option value="4">多选</option>
                            <option value="5">日期</option>
                            <option value="6">复选框</option>
                            <option value="7">人员</option>
                            <option value="8">电话号码</option>
                        </select>
                    </label>
                {/if}

                <p class="btns">
                    <button>确定✅</button>
                    <button>取消</button>
                </p>
            </div>
        {/if}
    </div>
{/if}

<style lang="postcss">
    .field-options {
        position: absolute;
        left: 0;
        top: 100%;
        width: 100%;
        background-color: white;
        box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
        z-index: 9;
    }
</style>
